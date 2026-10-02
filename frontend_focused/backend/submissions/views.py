from rest_framework import viewsets

from . import models, serializers


class SubmissionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = models.Submission.objects.all()
    serializer_class = serializers.SubmissionListSerializer