from django import forms
from django.conf import settings
from django.contrib import admin, messages
from django.db import transaction
from django.db.models import F, Q, Count
from django.http import HttpResponseRedirect
from django.shortcuts import get_object_or_404, render
from django.urls import path, reverse
from django.utils.html import format_html

from astrosat_users.admin import CustomerAdmin as AstrosatUserCustomerAdmin
from astrosat_users.models import Customer as AstrosatUserCustomer

from orbis.models import LicencedCustomer, Orb


class CustomerAdmin(AstrosatUserCustomerAdmin):
    """
    Redefines the default CustomerAdmin to include some extra
    actions to do w/ licences; These are included in the DetailView
    instead of the ListView so that I am forced to work w/ one Customer
    at-a-time so that I can restrict the CustomerUsers to valid choices.
    """

    fields = None
    fieldsets = (
        (
            "Actions",
            {
                "classes": ("collapse", ),
                "fields": ("get_grant_licences_for_detail_display", ),
            },
        ),
        (
            None,
            {
                "fields": AstrosatUserCustomerAdmin.fields
            },
        ),
    )
    readonly_fields = AstrosatUserCustomerAdmin.readonly_fields + (
        "get_grant_licences_for_detail_display",
    )

    ###################
    # detail displays #
    ###################

    def get_urls(self):
        # adding some "local" urls to map to the "grant_licences" action below
        urls = [
            path(
                "<slug:id>/grant/",
                self.grant_licences,
                name=f"{LicencedCustomer._meta.db_table}_grant",
            ),
        ] + super().get_urls()  # (order is important)
        return urls

    def get_grant_licences_for_detail_display(self, obj):
        if obj.pk:
            description = "Add licences to specific orbs in bulk to this customer."
            url = reverse(
                f"admin:{LicencedCustomer._meta.db_table}_grant", args=[obj.id]
            )
            return format_html(
                f"<a href='{url}' title='{description}'>Grant Data Access</a>"
            )
        else:
            return format_html("----------")

    get_grant_licences_for_detail_display.short_description = "Grant Data Access"

    ###########
    # actions #
    ###########

    def grant_licences(self, request, id):

        # this action uses an intermediary page w/ a form to get values

        customer = get_object_or_404(LicencedCustomer, id=id)

        class GrantLicencesForm(forms.Form):
            orb = forms.ModelChoiceField(
                label="Orb to grant access to",
                queryset=Orb.objects.filter(is_active=True),
                required=True,
            )
            n_additional_licences = forms.IntegerField(
                initial=0,
                label="Number of extra licences to grant",
                min_value=0,
                required=True,
            )
            customer_users = forms.ModelMultipleChoiceField(
                label="Users to assign licences for",
                queryset=customer.customer_users.all(),
                required=False,
            )
            ignore_existing = forms.BooleanField(
                initial=True,
                label=
                "Ignore users that already have a licence to the selected Orb.",
                required=False,
            )

            def clean(self):
                cleaned_data = super().clean()
                orb = cleaned_data["orb"]
                licences = orb.licences.filter(orb=orb)
                customer_users = cleaned_data["customer_users"]
                if customer_users.exists():
                    n_available_licences = cleaned_data[
                        "n_additional_licences"] + licences.available().count()
                    n_required_licences = customer_users.count(
                    ) - licences.filter(customer_user__in=customer_users
                                       ).count()
                    if n_available_licences < n_required_licences:
                        raise forms.ValidationError(
                            "You are not granting enough licences for the number of selected users"
                        )

                return cleaned_data

        form = GrantLicencesForm(request.POST or None)

        if "apply" in request.POST:

            if form.is_valid():

                orb = form.cleaned_data["orb"]
                n_additional_licences = form.cleaned_data[
                    "n_additional_licences"]
                customer_users = form.cleaned_data["customer_users"]
                ignore_existing = form.cleaned_data["ignore_existing"]

                try:
                    # this action should be all-or-nothing, if any part of it fails
                    # no licences should be granted; hence the "atomic" block below
                    with transaction.atomic():
                        added_licences = customer.add_licences(
                            orb, n_additional_licences
                        )
                        assigned_licences = customer.assign_licences(
                            orb,
                            customer_users,
                            ignore_existing=ignore_existing,
                            add_missing=False
                        )

                        for licence in added_licences:
                            msg = f"added licence '{licence.id}' to orb '{orb}'."
                            self.message_user(request, msg)
                        for licence in assigned_licences:
                            msg = f"assigned licence '{licence.id}' (to orb '{orb}') to user '{licence.customer_user}'."
                            self.message_user(request, msg)
                        if not added_licences and not assigned_licences:
                            msg = "No licences were added or assigned."
                            self.message_user(
                                request, msg, level=messages.WARNING
                            )

                except Exception as e:
                    self.message_user(request, str(e), level=messages.ERROR)

                change_url = reverse(
                    f"admin:{LicencedCustomer._meta.db_table}_change",
                    args=[id]
                )
                return HttpResponseRedirect(change_url)

        # provides summary information about the current (visible) licences owned by this customer
        # (effectively, this performs a "group_by" statement and then adds some extra annotations)
        customer_licences_summary = customer.licences.all(
        ).values("orb").annotate(
            name=F("orb__name"),
            total_licences=Count("orb"),
            unassigned_licences=Count(
                "orb", filter=Q(customer_user__isnull=True)
            ),
        ).order_by("orb__name")

        context = {
            "customer": customer,
            "summary": customer_licences_summary,
            "form": form,
            "opts": self.model._meta,
            "site_header": getattr(settings, "ADMIN_SITE_HEADER", None),
            "site_title": getattr(settings, "ADMIN_SITE_TITLE", None),
            "index_title": getattr(settings, "ADMIN_INDEX_TITLE", None),
        }
        return render(
            request, "orbis/admin/grant_licences.html", context=context
        )


#############################################################################
# ensure existing references to AstrosatUserCustomer use this CustomerAdmin #
#############################################################################
try:
    admin.site.unregister(AstrosatUserCustomer)
except admin.sites.NotRegistered:
    pass
admin.site.register(AstrosatUserCustomer, CustomerAdmin)
