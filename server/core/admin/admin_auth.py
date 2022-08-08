from datetime import timedelta

from django import forms
from django.conf import settings
from django.contrib import admin, messages
from django.core.mail import mail_managers
from django.db import transaction
from django.db.models import Q
from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.urls import path, reverse
from django.utils.html import format_html

from allauth.account import app_settings as allauth_settings
from allauth.account.adapter import get_adapter
from allauth.account.models import EmailAddress

from astrosat.admin import CannotAddModelAdminBase, CannotDeleteModelAdminBase, ReadOnlyModelAdminBase
from astrosat_users.models import Customer, CustomerUser, User, UserSettings
from astrosat_users.models.models_users import UserRegistrationStageType

from orbis.models import Document, LicencedCustomer, Orb

from maps.models import MapStyle

from core.admin import core_admin_site

PRIVACY_DOCUMENT_NAME = "general_privacy"

TERMS_DOCUMENT_NAME = "customer_terms"

#########
# forms #
#########


class AuthCustomerRegisterForm(forms.ModelForm):
    class Meta:
        model = Customer
        fields = (
            "name",
            "official_name",
            "company_type",
            "registered_id",
            "vat_number",
            "description",
            "url",
            "country",
            "address",
            "postcode",
        )


class AuthUserRegisterForm(forms.ModelForm):
    class Meta:
        model = User
        fields = (
            "email",
            "name",
            "phone",
            "is_approved",
            "accepted_terms",
        )

    def clean_email(self):
        # using email as username,
        # so check if it's unique...
        email = self.cleaned_data["email"]
        if User.objects.filter(Q(email=email) or Q(username=email)).exists():
            raise forms.ValidationError("This email address is not unique.")
        return email


class AuthCustomerUserRegisterForm(forms.Form):
    # note, this is a Form and not a ModelForm
    orbs = forms.ModelMultipleChoiceField(
        label="Orbs to grant access to",
        queryset=Orb.objects.filter(is_active=True),
        required=True,
    )

    n_licences = forms.IntegerField(
        # TODO: WOULD BE NICE TO SET N_LICENCES PER ORB
        label="Number of licences to grant to the customer",
        initial=10,
        min_value=1,
        required=True,
    )


###########
# filters #
###########


class AuthSimpleListFilter(admin.SimpleListFilter):
    def lookups(self, request, model_admin):
        return (
            ("Yes", "Yes"),
            ("No", "No"),
        )


class IsApprovedCustomerUserFilter(AuthSimpleListFilter):
    parameter_name = "is_approved_for_list_display"
    title = "is approved"

    def queryset(self, request, qs):
        value = self.value()
        if value == "Yes":
            qs = qs.filter(user__is_approved=True)
        elif value == "No":
            qs = qs.exclude(user__is_approved=True)
        return qs


class IsVerifiedUserFilter(AuthSimpleListFilter):
    filter_kwarg = "email__in"
    parameter_name = "is_verified_for_list_display"
    title = "is verified"

    def queryset(self, request, qs):
        value = self.value()
        verified_emails = EmailAddress.objects.filter(
            primary=True,
            verified=True,
        ).values_list("email", flat=True)

        if value == "Yes":
            qs = qs.filter(**{self.filter_kwarg: verified_emails})
        elif value == "No":
            qs = qs.exclude(**{self.filter_kwarg: verified_emails})
        return qs


class IsVerifiedCustomerUserFilter(IsVerifiedUserFilter):
    filter_kwarg = "user__email__in"
    parameter_name = "is_verified_for_list_display"
    title = "is verified"


##########
# admins #
##########


@admin.register(Customer, site=core_admin_site)
class AuthCustomerAdmin(ReadOnlyModelAdminBase, admin.ModelAdmin):
    fields = (
        "id",
        "created",
        "is_active",
        "customer_type",
        "name",
        "official_name",
        "company_type",
        "registered_id",
        "vat_number",
        "description",
        "logo",
        "url",
        "country",
        "address",
        "postcode",
    )
    list_filter = ("company_type", )
    search_fields = (
        "name",
        "official_name",
    )


@admin.register(User, site=core_admin_site)
class AuthUserAdmin(ReadOnlyModelAdminBase, admin.ModelAdmin):
    actions = (
        "toggle_approval",
        "toggle_verication",
        "onboard",
    )
    fields = (
        "uuid",
        "username",
        "name",
        "email",
        "phone",
        "change_password",
        "is_approved",
        "is_active",
        "is_superuser",
        "accepted_terms",
        "onboarded",
        "roles",
    )
    filter_horizontal = ("roles", )
    list_display = (
        "username",
        "get_customers_for_list_display",
        "is_approved",
        "is_verified_for_list_display",
    )
    list_filter = (
        "is_approved",
        IsVerifiedUserFilter,
        "customers",
    )
    search_fields = (
        "username",
        "name",
        "email",
    )

    def get_queryset(self, request):
        # pre-fetching m2m fields that are used in list_displays
        # to avoid the "n+1" problem
        queryset = super().get_queryset(request)
        return queryset.prefetch_related("customers")

    @admin.display(description="IS VERIFIED", boolean=True)
    def is_verified_for_list_display(self, instance):
        return instance.is_verified

    @admin.display(description="CUSTOMERS")
    def get_customers_for_list_display(self, obj):
        admin_change_url = f"{core_admin_site.name}:{Customer._meta.db_table}_change"
        list_display = [
            f"<a href='{reverse(admin_change_url, args=[customer.id])}'>{customer.name}</a>"
            for customer in obj.customers.all()
        ]
        return format_html(",".join(list_display))

    @admin.display(description="Toggles the approval of the selected users")
    def toggle_approval(self, request, queryset):
        # TODO: doing this cleverly w/ negated F expressions is not supported (https://code.djangoproject.com/ticket/17186)
        # queryset.update(is_approved=not(F("is_approved")))
        for obj in queryset:
            obj.is_approved = not obj.is_approved
            obj.save()

            self.message_user(
                request,
                f"{obj} {'not' if not obj.is_approved else ''} approved."
            )

    @admin.display(
        description=
        "Toggles the verification of the selected users' primary email addresses"
    )
    def toggle_verication(self, request, queryset):

        for obj in queryset:

            emailaddress, created = obj.emailaddress_set.get_or_create(
                user=obj, email=obj.email
            )
            if not emailaddress.primary:
                emailaddress.set_as_primary(conditional=True)

            emailaddress.verified = not emailaddress.verified
            emailaddress.save()

            self.message_user(
                request,
                f"{emailaddress} {'created and' if created else ''} {'not' if not emailaddress.verified else ''} verified."
            )


@admin.register(CustomerUser, site=core_admin_site)
class AuthCustomerUserAdmin(
    CannotAddModelAdminBase, CannotDeleteModelAdminBase, admin.ModelAdmin
):
    """
    Special "Core" Admin for manually registering a CustomerUser
    """
    actions = ("resend_invitation", )
    change_list_template = "core/admin/customer_user_changelist.html"
    fields = (
        "customer",
        "user",
        "customer_user_type",
        "customer_user_status",
        "invitation_date",
        "invitation_expiry_date_for_detail_display",
    )
    list_display = (
        "id_for_list_display",
        "is_approved_for_list_display",
        "is_verified_for_list_display",
    )
    list_filter = (
        IsApprovedCustomerUserFilter,
        IsVerifiedCustomerUserFilter,
    )
    readonly_fields = (
        "customer",
        "user",
        "invitation_date",
        "invitation_expiry_date_for_detail_display",
    )
    search_fields = (
        "customer__name",
        "customer__official_name",
        "user__username",
        "user__email",
    )

    @admin.display(
        description="Resends invitations to the selected CustomerUsers"
    )
    def resend_invitation(self, request, queryset):
        request.force_api = True
        request.META["HTTP_ORIGIN"] = settings.CLIENT_HOST
        adapter = get_adapter(request)
        for customer_user in queryset:
            customer_user.invite(adapter=adapter)
            self.message_user(
                request,
                f"sent invitation email to '{customer_user.user}'.",
                level=messages.INFO
            )

    @admin.display(description="CUSTOMER: USER")
    def id_for_list_display(self, instance):
        return str(instance)

    @admin.display(description="IS APPROVED", boolean=True)
    def is_approved_for_list_display(self, instance):
        return instance.user.is_approved

    @admin.display(description="IS VERIFIED", boolean=True)
    def is_verified_for_list_display(self, instance):
        return instance.user.is_verified

    @admin.display(description="Invitation expiry date")
    def invitation_expiry_date_for_detail_display(self, instance):
        DATETIME_FORMAT = "%-d %b %Y, %I:%M %p"
        if instance.invitation_date:
            invitation_expiry_date = instance.invitation_date + timedelta(
                days=allauth_settings.EMAIL_CONFIRMATION_EXPIRE_DAYS
            )
            return invitation_expiry_date.strftime(DATETIME_FORMAT)

    def get_urls(self):
        # adding some "local" urls to map to the "register_customer_user" action below
        urls = [
            path(
                "register/",
                self.register_customer_user,
                name=f"{CustomerUser._meta.db_table}_register",
            ),
        ] + super().get_urls()  # (order is important)
        return urls

    def register_customer_user(self, request):
        """
        This allows an admin to register a customer & user on their behalf.
        It will create a customer and a user and link the two together.
        It will add some number of licences to that customer and assign 1 of them to the user.
        It force the user to (re)set their password.
        It will send an invitation email to the user.
        Upon clicking the link in the invitation email, the user will be asked to reset their password.
        Upon resetting their password they will be redirected to login.
        Upon logging in they will be sent an onboarding email.
        """

        USER_SETTINGS = UserSettings.load()

        customer_form = AuthCustomerRegisterForm(
            request.POST or None,
            prefix="customer",
        )
        user_form = AuthUserRegisterForm(
            request.POST or None,
            prefix="user",
        )
        customer_user_form = AuthCustomerUserRegisterForm(
            request.POST or None,
            prefix="customer_user",
        )

        if "apply" in request.POST:

            msgs = []
            if customer_form.is_valid() and user_form.is_valid() and customer_user_form.is_valid():  # yapf: disable
                # force the adapter to assume the request came from the client instead of
                # the admin (so that any auto-generated emails point to the correct URL)
                request.force_api = True
                request.META["HTTP_ORIGIN"] = settings.CLIENT_HOST
                adapter = get_adapter(request)
                try:
                    # this action should be all-or-nothing, if any part of it fails
                    # no db changes should be made; hence the "atomic" block below
                    with transaction.atomic():

                        # create the customer...
                        customer = LicencedCustomer.cast(customer_form.save())
                        msgs.append(
                            (f"created customer: {customer}", messages.SUCCESS)
                        )

                        # Add MapStyle instances to Customer.
                        map_styles = MapStyle.objects.filter(is_default=True)
                        customer.map_styles.add(*map_styles)

                        # create the user...
                        user = user_form.save(commit=False)
                        user.username = user_form.cleaned_data["email"]
                        user.change_password = True  # (force password reset)
                        user.registration_stage = UserRegistrationStageType.ONBOARD  # (onboard the user after password reset)
                        user.save()
                        msgs.append((f"created user: {user}", messages.SUCCESS))
                        if not user.is_approved:
                            msgs.append(
                                (f"{user} is not approved", messages.WARNING)
                            )

                        # deal w/ their password...
                        password = User.objects.make_random_password(
                            length=USER_SETTINGS.password_min_length
                        )
                        user.set_password(password)
                        user.save()

                        # make sure they've accepted T&C...
                        if user.accepted_terms:
                            user.documents.add(
                                Document.objects.terms().no_orbs().active().get(
                                    name=TERMS_DOCUMENT_NAME
                                ),
                                Document.objects.privacy().no_orbs().active().
                                get(name=PRIVACY_DOCUMENT_NAME),
                            )

                        # give them an email_address (but don't verify it)...
                        email_address, _ = EmailAddress.objects.get_or_create(
                            user=user, email=user.email
                        )
                        email_address.set_as_primary(conditional=True)

                        # add user to customer...
                        customer_user, _ = customer.add_user(user, type="MANAGER")
                        msgs.append((
                            f"added user '{user}' to customer '{customer}'.",
                            messages.INFO
                        ))

                        # add licences to orbs...
                        orbs = customer_user_form.cleaned_data["orbs"]
                        n_licences = customer_user_form.cleaned_data[
                            "n_licences"]
                        for orb in orbs:
                            added_licences = customer.add_licences(
                                orb,
                                n_licences,
                            )
                            assigned_licences = customer.assign_licences(
                                orb,
                                [customer_user],
                                add_missing=False,
                                ignore_existing=False,
                            )

                            msgs.append((
                                f"added {n_licences} licences to orb '{orb}' to customer '{customer}' .",
                                messages.INFO
                            ))
                            msgs.append((
                                f"assigned a licence to orb '{orb}' to user '{customer_user}'.",
                                messages.INFO
                            ))

                        # notify the user (send the invitation email)...
                        customer_user.invite(adapter=adapter)
                        msgs.append((
                            f"sent invitation email to '{email_address}'.",
                            messages.INFO
                        ))

                        # notify the admin...
                        if USER_SETTINGS.notify_signups:
                            subject = adapter.format_email_subject(
                                f"new user signup: {user}"
                            )
                            message = f"User {user.email} signed up for an account."
                            mail_managers(subject, message, fail_silently=True)

                        for msg in msgs:
                            self.message_user(request, msg[0], level=msg[1])

                except Exception as e:
                    self.message_user(request, str(e), level=messages.ERROR)

                list_url = reverse(
                    f"{core_admin_site.name}:{CustomerUser._meta.db_table}_changelist"
                )
                return HttpResponseRedirect(list_url)

        return render(
            request,
            "core/admin/customer_user_register.html",
            context={
                "customer_form": customer_form,
                "user_form": user_form,
                "customer_user_form": customer_user_form,
                "opts": self.model._meta,
                "site_header": core_admin_site.site_header,
                "site_title": core_admin_site.site_title,
                "index_title": core_admin_site.index_title,
            },
        )
