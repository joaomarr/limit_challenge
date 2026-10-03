from django.db.models import Count
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from . import models, serializers
from .filters import SubmissionFilterSet


class SubmissionViewSet(viewsets.ReadOnlyModelViewSet):
    filterset_class = SubmissionFilterSet

    def get_queryset(self):
        queryset = models.Submission.objects.select_related("company", "broker", "owner")

        if self.action == "retrieve":
            return queryset.prefetch_related("contacts", "documents", "notes")

        return (
            queryset
            .prefetch_related("notes")
            .annotate(
                document_count=Count("documents", distinct=True),
                note_count=Count("notes", distinct=True),
            )
            .order_by("-created_at", "-id")
        )

    def get_serializer_class(self):
        if self.action == "retrieve":
            return serializers.SubmissionDetailSerializer
        return serializers.SubmissionListSerializer

    @action(detail=False, url_path="status-counts")
    def status_counts(self, request):
        """Submissions per status, honouring every list filter except status itself.

        Powers the counts on the status tabs: with "High priority" selected, each tab
        shows how many high-priority submissions it holds.
        """
        params = request.query_params.copy()
        params.pop("status", None)
        filterset = SubmissionFilterSet(params, queryset=models.Submission.objects.all())
        if not filterset.is_valid():
            raise ValidationError(filterset.errors)

        totals = dict(
            filterset.qs.order_by().values_list("status").annotate(total=Count("id"))
        )
        # A list rather than {status: count}: the camelCase renderer would rewrite
        # "in_review" as a key into "inReview".
        return Response(
            [
                {"status": status, "count": totals.get(status, 0)}
                for status in models.Submission.Status.values
            ]
        )


class BrokerViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = models.Broker.objects.all()
    serializer_class = serializers.BrokerSerializer
    # The frontend loads every broker into a dropdown, so return a plain list.
    pagination_class = None
