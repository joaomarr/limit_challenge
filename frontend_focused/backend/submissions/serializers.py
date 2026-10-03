from rest_framework import serializers

from . import models

NOTE_PREVIEW_LENGTH = 120


class BrokerSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Broker
        fields = ["id", "name", "primary_contact_email"]


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Company
        fields = ["id", "legal_name", "industry", "headquarters_city"]


class TeamMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.TeamMember
        fields = ["id", "full_name", "email"]


class SubmissionListSerializer(serializers.ModelSerializer):
    company = CompanySerializer()
    broker = BrokerSerializer()
    owner = TeamMemberSerializer()
    document_count = serializers.IntegerField(read_only=True)
    note_count = serializers.IntegerField(read_only=True)
    latest_note = serializers.SerializerMethodField()

    class Meta:
        model = models.Submission
        fields = [
            "id",
            "status",
            "priority",
            "summary",
            "created_at",
            "updated_at",
            "company",
            "broker",
            "owner",
            "document_count",
            "note_count",
            "latest_note",
        ]

    def get_latest_note(self, submission):
        # Iterate the prefetched notes (already newest first) instead of calling
        # .first(), which would hit the database once per submission.
        notes = list(submission.notes.all())
        if not notes:
            return None
        note = notes[0]
        return {
            "author_name": note.author_name,
            "body_preview": note.body[:NOTE_PREVIEW_LENGTH],
            "created_at": note.created_at,
        }


class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Contact
        fields = ["id", "name", "role", "email", "phone"]


class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Document
        fields = ["id", "title", "doc_type", "uploaded_at", "file_url"]


class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Note
        fields = ["id", "author_name", "body", "created_at"]


class SubmissionDetailSerializer(serializers.ModelSerializer):
    company = CompanySerializer()
    broker = BrokerSerializer()
    owner = TeamMemberSerializer()
    contacts = ContactSerializer(many=True)
    documents = DocumentSerializer(many=True)
    notes = NoteSerializer(many=True)

    class Meta:
        model = models.Submission
        fields = [
            "id",
            "status",
            "priority",
            "summary",
            "created_at",
            "updated_at",
            "company",
            "broker",
            "owner",
            "contacts",
            "documents",
            "notes",
        ]

