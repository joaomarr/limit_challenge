import django_filters
from django.db.models import Exists, OuterRef

from submissions.models import Document, Note, Submission


class SubmissionFilterSet(django_filters.FilterSet):
    # Query params arrive camelCased (?brokerId=) and are converted to snake_case
    # by CamelCaseMiddleWare before reaching this filterset.
    status = django_filters.ChoiceFilter(choices=Submission.Status.choices)
    priority = django_filters.ChoiceFilter(choices=Submission.Priority.choices)
    broker_id = django_filters.NumberFilter(field_name="broker_id")
    company_search = django_filters.CharFilter(
        field_name="company__legal_name", lookup_expr="icontains"
    )
    created_from = django_filters.DateFilter(field_name="created_at", lookup_expr="date__gte")
    created_to = django_filters.DateFilter(field_name="created_at", lookup_expr="date__lte")
    has_documents = django_filters.BooleanFilter(method="filter_has_documents")
    has_notes = django_filters.BooleanFilter(method="filter_has_notes")

    class Meta:
        model = Submission
        fields = []

    def filter_has_documents(self, queryset, name, value):
        return _filter_has_related(queryset, Document, value)

    def filter_has_notes(self, queryset, name, value):
        return _filter_has_related(queryset, Note, value)


def _filter_has_related(queryset, model, value):
    # EXISTS keeps one row per submission, so it can't inflate the list counts.
    has_related = Exists(model.objects.filter(submission=OuterRef("pk")))
    return queryset.filter(has_related if value else ~has_related)
