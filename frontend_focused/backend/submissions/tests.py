from datetime import datetime, timezone

from rest_framework.test import APITestCase

from . import models


def make_submission(company_name="Acme Corp", broker=None, created_at=None, **fields):
    broker = broker or models.Broker.objects.create(name="Default Brokerage")
    company = models.Company.objects.create(legal_name=company_name)
    owner, _ = models.TeamMember.objects.get_or_create(
        email="owner@example.com", defaults={"full_name": "Olivia Owner"}
    )
    if created_at:
        fields["created_at"] = created_at
    return models.Submission.objects.create(
        company=company, broker=broker, owner=owner, **fields
    )


def add_documents(submission, count):
    for i in range(count):
        models.Document.objects.create(submission=submission, title=f"Doc {i}", doc_type="Summary")


def add_notes(submission, count):
    for i in range(count):
        models.Note.objects.create(
            submission=submission,
            author_name=f"Author {i}",
            body=f"Note {i}",
            created_at=datetime(2026, 1, 1 + i, tzinfo=timezone.utc),
        )


class SubmissionListTests(APITestCase):
    url = "/api/submissions/"

    def test_counts_are_not_multiplied_by_each_other(self):
        submission = make_submission()
        add_documents(submission, 4)
        add_notes(submission, 5)

        item = self.client.get(self.url).json()["results"][0]

        # Two Counts over joined tables would report 20 and 20 here.
        self.assertEqual(item["documentCount"], 4)
        self.assertEqual(item["noteCount"], 5)

    def test_latest_note_is_the_newest_one(self):
        submission = make_submission()
        add_notes(submission, 3)

        latest = self.client.get(self.url).json()["results"][0]["latestNote"]

        self.assertEqual(latest["authorName"], "Author 2")

    def test_latest_note_body_is_truncated(self):
        submission = make_submission()
        models.Note.objects.create(submission=submission, author_name="A", body="x" * 500)

        latest = self.client.get(self.url).json()["results"][0]["latestNote"]

        self.assertEqual(len(latest["bodyPreview"]), 120)

    def test_latest_note_is_null_without_notes(self):
        make_submission()

        item = self.client.get(self.url).json()["results"][0]

        self.assertIsNone(item["latestNote"])

    def test_newest_submissions_come_first(self):
        older = make_submission(created_at=datetime(2026, 1, 1, tzinfo=timezone.utc))
        newer = make_submission(created_at=datetime(2026, 2, 1, tzinfo=timezone.utc))

        ids = [item["id"] for item in self.client.get(self.url).json()["results"]]

        self.assertEqual(ids, [newer.id, older.id])

    def test_query_count_does_not_grow_with_page_size(self):
        for _ in range(10):
            submission = make_submission()
            add_documents(submission, 2)
            add_notes(submission, 2)

        # pagination count + submissions + prefetched notes
        with self.assertNumQueries(3):
            self.client.get(self.url)


class SubmissionFilterTests(APITestCase):
    url = "/api/submissions/"

    def get_ids(self, params):
        return {item["id"] for item in self.client.get(self.url, params).json()["results"]}

    def test_filter_by_status(self):
        new = make_submission(status=models.Submission.Status.NEW)
        make_submission(status=models.Submission.Status.CLOSED)

        self.assertEqual(self.get_ids({"status": "new"}), {new.id})

    def test_filter_by_broker_id(self):
        broker = models.Broker.objects.create(name="Target Brokerage")
        target = make_submission(broker=broker)
        make_submission()

        self.assertEqual(self.get_ids({"brokerId": broker.id}), {target.id})

    def test_company_search_is_case_insensitive_and_partial(self):
        match = make_submission(company_name="Northwind Traders")
        make_submission(company_name="Contoso")

        self.assertEqual(self.get_ids({"companySearch": "northW"}), {match.id})

    def test_created_date_range_includes_both_ends(self):
        make_submission(created_at=datetime(2026, 1, 9, 12, tzinfo=timezone.utc))
        first = make_submission(created_at=datetime(2026, 1, 10, 8, tzinfo=timezone.utc))
        last = make_submission(created_at=datetime(2026, 1, 20, 23, tzinfo=timezone.utc))
        make_submission(created_at=datetime(2026, 1, 21, 1, tzinfo=timezone.utc))

        ids = self.get_ids({"createdFrom": "2026-01-10", "createdTo": "2026-01-20"})

        self.assertEqual(ids, {first.id, last.id})

    def test_has_documents(self):
        with_docs = make_submission()
        add_documents(with_docs, 2)
        without_docs = make_submission()

        self.assertEqual(self.get_ids({"hasDocuments": "true"}), {with_docs.id})
        self.assertEqual(self.get_ids({"hasDocuments": "false"}), {without_docs.id})

    def test_has_notes_does_not_change_counts(self):
        submission = make_submission()
        add_documents(submission, 3)
        add_notes(submission, 2)

        item = self.client.get(self.url, {"hasNotes": "true"}).json()["results"][0]

        self.assertEqual((item["documentCount"], item["noteCount"]), (3, 2))

    def test_invalid_status_returns_400(self):
        response = self.client.get(self.url, {"status": "bogus"})

        self.assertEqual(response.status_code, 400)


class SubmissionDetailTests(APITestCase):
    def test_includes_related_records(self):
        submission = make_submission()
        add_documents(submission, 2)
        add_notes(submission, 3)
        models.Contact.objects.create(submission=submission, name="Carla Contact")

        data = self.client.get(f"/api/submissions/{submission.id}/").json()

        self.assertEqual(data["company"]["legalName"], "Acme Corp")
        self.assertEqual(len(data["contacts"]), 1)
        self.assertEqual(len(data["documents"]), 2)
        self.assertEqual([note["authorName"] for note in data["notes"]], ["Author 2", "Author 1", "Author 0"])

    def test_missing_submission_returns_404(self):
        response = self.client.get("/api/submissions/999/")

        self.assertEqual(response.status_code, 404)


class BrokerListTests(APITestCase):
    def test_returns_unpaginated_list(self):
        models.Broker.objects.create(name="Beta Brokerage")
        models.Broker.objects.create(name="Alpha Brokerage")

        data = self.client.get("/api/brokers/").json()

        self.assertEqual([broker["name"] for broker in data], ["Alpha Brokerage", "Beta Brokerage"])
