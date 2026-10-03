from django.db.models import Count
from rest_framework import viewsets

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


class BrokerViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = models.Broker.objects.all()
    serializer_class = serializers.BrokerSerializer
    # The frontend loads every broker into a dropdown, so return a plain list.
    pagination_class = None
