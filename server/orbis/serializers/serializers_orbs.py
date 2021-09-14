import base64

from rest_framework import serializers

from drf_yasg2.utils import swagger_serializer_method

from astrosat.serializers import ContextVariableDefault, WritableNestedListSerializer

from astrosat_users.models import Customer

from orbis.models import Orb, OrbImage, Licence
from orbis.serializers.serializers_documents import DocumentSerializer


class OrbImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrbImage
        fields = ("file", )


class OrbSerializer(serializers.ModelSerializer):
    class Meta:
        model = Orb
        fields = (
            "id",
            "name",
            "description",
            "short_description",
            "logo",
            "images",
            "terms_document",
            "features",
            "licence_cost",
        )

    logo = serializers.SerializerMethodField(method_name="get_logo_b64")
    images = serializers.SerializerMethodField(method_name="get_images_files")
    terms_document = serializers.SerializerMethodField()

    @swagger_serializer_method(serializer_or_field=serializers.CharField())
    def get_logo_b64(self, obj):
        """
        takes a logo SVG file and returns a base64 encoding of the data
        """
        if obj.logo:
            logo_data = obj.logo.read()
            return base64.b64encode(logo_data)

    @swagger_serializer_method(
        serializer_or_field=serializers.ListField(
            child=serializers.CharField()
        )
    )
    def get_images_files(self, obj):
        """
        extracts just the "file" field from the OrbImageSerializer
        """
        image_serializer = OrbImageSerializer(
            obj.images.all(), context=self.context, many=True
        )
        return [image_data.get("file") for image_data in image_serializer.data]

    def get_terms_document(self, obj):
        terms_document = obj.documents.terms().active().first()
        if terms_document:
            return DocumentSerializer(terms_document).data["file"]


class LicenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Licence
        fields = (
            "id",
            "orb",
            "customer",
            "customer_user",
            "access",
        )
        list_serializer_class = WritableNestedListSerializer

    id = serializers.UUIDField(read_only=True)
    orb = serializers.SlugRelatedField(
        slug_field="name", queryset=Orb.objects.active()
    )
    customer = serializers.SlugRelatedField(
        # a licence can only exist w/ a pre-existing customer, and
        # I will only CRUD licences in the context of a customer, so
        # if I don't include a customer, provide it from the context
        default=ContextVariableDefault("customer"),
        queryset=Customer.objects.all(),
        slug_field="name",
    )

    def to_internal_value(self, data):
        # put the read-only "id" field back, since it's used to
        # identify unique models in WriteableNestedListSerializer
        id_field_name = "id"
        internal_value = super().to_internal_value(data)
        if id_field_name not in internal_value and id_field_name in data:
            id_field_serializer = self.fields[id_field_name]
            internal_value[id_field_name
                          ] = id_field_serializer.to_internal_value(
                              data[id_field_name]
                          )
        return internal_value
