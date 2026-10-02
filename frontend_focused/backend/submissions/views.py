from rest_framework import viewsets

from . import models, serializers


class SubmissionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = models.Submission.objects.select_related("company", "broker", "owner")
    serializer_class = serializers.SubmissionListSerializer