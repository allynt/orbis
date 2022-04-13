import uuid

from django.conf import settings
from django.db import models
from django.contrib.gis.db import models as gis_models
# from django.contrib.gis.geos import GEOSGeometry
from django.contrib.postgres.fields import ArrayField
from django.utils.translation import gettext as _

from astrosat.utils import validate_schema

# FIXME: Uncomment this when the data shape is fixed.
# REPORT_STATE_SCHEMA = {
#     # defines the schema of the report_state JSONField below
#     "summary": {
#         "type": "array",
#         "items": {
#             "type": "object",
#             "properties": {
#                 "type": {
#                     "type": "string",
#                 },
#                 "impact": {
#                     "type": "string",
#                 },
#             },
#         },
#     },
#     "areas": {
#         "type": "array",
#         "items": {
#             "type": "object",
#             "properties": {
#                 "title": {
#                     "type": "string",
#                 },
#             },
#         },
#     },
#     "impacts": {
#         "type": "array",
#         "items": {
#             "type": "object",
#             "properties": {
#                 "name": {
#                     "type": "string",
#                 },
#                 "impact": {
#                     "type": "object",
#                     "properties": {
#                         "name": {
#                             "type": "string",
#                         },
#                         "effect": {
#                             "type": "string",
#                         },
#                     },
#                 },
#             },
#         },
#     },
#     "required": ["summary", "areas", "impacts"],
# }


def validate_report_state(value):
    # return validate_schema(value, REPORT_STATE_SCHEMA)
    return True


class ProposalManager(models.Manager):
    pass


class ProposalQuerySet(models.QuerySet):
    pass


class Proposal(gis_models.Model):
    class Meta:
        verbose_name = _('Proposal')
        verbose_name_plural = _('Proposals')
        ordering = ('-created', )
        constraints = [
            models.UniqueConstraint(
                fields=["name", "owner"],
                name="unique_name_owner",
            ),
        ]

    objects = ProposalManager.from_queryset(ProposalQuerySet)()

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    name = models.CharField(
        max_length=64,
        null=False,
        blank=False,
        help_text=_('Name of the proposal')
    )

    description = models.TextField(
        null=True, blank=True, help_text=_('Description of the proposal')
    )

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=False,
        blank=False,
        related_name="proposals",
        help_text=_('Owner of the proposal')
    )

    # Form fields
    geometry = gis_models.GeometryField(
        null=True, blank=True, help_text=_('Geometry of the proposal')
    )

    proposal_description = models.TextField(
        null=True,
        blank=True,
        help_text=_('Description of the work being proposed')
    )

    # The date the proposal was created.
    proposal_start_date = models.DateTimeField(
        null=True, blank=True, help_text=_('Start date of the proposal')
    )

    proposal_end_date = models.DateTimeField(
        null=True, blank=True, help_text=_('End date of the proposal')
    )

    proposal_activities = ArrayField(
        models.JSONField(
            max_length=255,
            blank=True,
        ),
        null=True,
        blank=True,
        help_text=_('Activities associated with the proposal')
    )

    report_generation_date = models.DateTimeField(
        null=True, blank=True, help_text=_('Date the report was generated')
    )

    report_state = models.JSONField(
        null=True,
        blank=True,
        validators=[validate_report_state],
        help_text=_(
            'JSON representation of the impact assessment report associated with the proposal'
        )
    )

    def __str__(self) -> str:
        return self.name
