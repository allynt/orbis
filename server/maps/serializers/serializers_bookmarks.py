import json

from django.contrib.auth import get_user_model
from django.contrib.gis.geos import Point

from rest_framework.serializers import (
    CurrentUserDefault,
    Field,
    ModelSerializer,
    PrimaryKeyRelatedField,
    SerializerMethodField,
    ValidationError,
)

from maps.models import Bookmark


class SimplifiedGeometryField(Field):
    """
    don't deal w/ the WKT serialization of the GeoDJango field
    just deal w/ a simple array
    """

    def __init__(self, *args, **kwargs):
        self.precision = kwargs.pop("precision", 12)
        self.geometry_class = kwargs.pop("geometry_class")
        super().__init__(*args, **kwargs)

    def to_representation(self, value):
        return map(lambda x: round(x, self.precision), value.coords)

    def to_internal_value(self, data):
        if isinstance(data, str):
            # data might have been passed as Stringified JSON
            data = json.loads(data)
        try:
            return self.geometry_class(data)
        except TypeError as e:
            raise ValidationError(str(e))


class BookmarkSerializer(ModelSerializer):
    # _not_ using GeoFeatureModelSerializer b/c I do not want to convert the whole queryset to GeoJSON
    class Meta:
        model = Bookmark
        fields = (
            "id",
            "owner",
            "title",
            "description",
            "zoom",
            "center",
            "feature_collection",
            "thumbnail",
        )

    owner = PrimaryKeyRelatedField(
        # if you don't pass an explicit owner, infer it from the request
        # (as per https://www.django-rest-framework.org/api-guide/validators/#currentuserdefault)
        queryset=get_user_model().objects.all(), default=CurrentUserDefault()
    )

    center = SimplifiedGeometryField(geometry_class=Point, precision=Bookmark.PRECISION)
