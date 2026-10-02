from rest_framework import serializers

from . import models


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
        ]

