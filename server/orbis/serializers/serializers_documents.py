from rest_framework import serializers

from orbis.models import Document, DocumentAgreement


class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = (
            "name",
            "version",
            "title",
            "type",
            "file",
        )


class DocumentAgreementSerializer(serializers.ModelSerializer):
    document = DocumentSerializer(read_only=True)

    class Meta:
        model = DocumentAgreement
        fields = (
            "document",
            "timestamp",
        )

    def to_representation(self, instance):
        # move the document fields to top-level
        representation = super().to_representation(instance)
        representation.update(representation.pop("document", {}))
        return representation
