from django.db.models import Count
from rest_framework import viewsets

from . import models, serializers


class SubmissionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = (
        models.Submission.objects
        .select_related("company", "broker", "owner")
        .annotate(
            document_count=Count("documents", distinct=True),
            note_count=Count("notes", distinct=True),
        )
        .order_by("-created_at", "-id")
    )
    serializer_class = serializers.SubmissionListSerializer
