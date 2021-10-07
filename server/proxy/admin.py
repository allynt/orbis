from django.contrib import admin, messages
from django.forms import Select, ModelForm
from django.utils.translation import gettext as _

from astrosat.admin import JSONAdminWidget

from proxy.adapters import PROXY_DATA_ADAPTER_REGISTRY
from proxy.authentication import ProxyAuthentication
from proxy.models import ProxyDataSource


class ProxyDataSourceAdminForm(ModelForm):
    """
    A custom Admin Form that makes the proxy_params and proxy_authentication_token
    fields pretty and restricts the adapter name to only those adapters defined in
    the PROXY_DATA_ADAPTER_REGISTRY
    """
    class Meta:
        model = ProxyDataSource
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["proxy_params"].widget = JSONAdminWidget()
        self.fields["proxy_authentication_token"].widget.attrs.update({
            "cols": 80, "class": "vLargeTextField"
        })
        self.fields["adapter_name"].widget = Select(
            choices=((adapter_name, adapter_name)
                     for adapter_name in sorted(PROXY_DATA_ADAPTER_REGISTRY))
        )


@admin.register(ProxyDataSource)
class ProxyDataSourceAdmin(admin.ModelAdmin):
    form = ProxyDataSourceAdminForm
    list_display = (
        "source_id",
        "adapter_name",
        "is_active",
    )
    list_editable = ("is_active", )
    search_fields = (
        "authority",
        "namespace",
        "name",
        "version",
    )

    def save_model(self, request, obj, form, change):

        authentication_type = obj.proxy_authentication_type

        if authentication_type == ProxyAuthentication.AuthenticationTypes.BASIC:
            if not (
                obj.proxy_authentication_username and
                obj.proxy_authentication_password
            ):
                msg = _(
                    "Basic Authentication requires a username and password."
                )
                self.message_user(request, msg, level=messages.WARNING)
            if obj.proxy_authentication_token:
                msg = _("Basic Authentication will not use a token")
                self.message_user(request, msg, level=messages.WARNING)

        elif authentication_type == ProxyAuthentication.AuthenticationTypes.BEARER:

            if not obj.proxy_authentication_token:
                msg = _("Bearer Authentication requires a token")
                self.message_user(request, msg, level=messages.WARNING)
            if (
                obj.proxy_authentication_username or
                obj.proxy_authentication_password
            ):
                msg = _(
                    "Bearer Authentication will not use username nor password."
                )
                self.message_user(request, msg, level=messages.WARNING)

        elif authentication_type == ProxyAuthentication.AuthenticationTypes.APIKEY:

            if not obj.proxy_authentication_token:
                msg = _("ApiKey Authentication requires a token")
                self.message_user(request, msg, level=messages.WARNING)
            if (
                obj.proxy_authentication_username or
                obj.proxy_authentication_password
            ):
                msg = _(
                    "ApiKey Authentication will not use username nor password."
                )
                self.message_user(request, msg, level=messages.WARNING)

        elif authentication_type == ProxyAuthentication.AuthenticationTypes.URL_PARAM:

            if (
                obj.proxy_authentication_token or
                obj.proxy_authentication_username or
                obj.proxy_authentication_password
            ):
                msg = _(
                    "URL-PARAM Authentication will not use token nor username nor password."
                )
                self.message_user(request, msg, level=messages.WARNING)
            if not obj.proxy_params:
                msg = _("URL-PARAM Authentication requires parameters.")
                self.message_user(request, msg, level=messages.WARNING)

        elif authentication_type == ProxyAuthentication.AuthenticationTypes.API_ALLOWREQUEST:

            if not obj.proxy_authentication_token:
                msg = _("API-AllowRequest Authentication requires a token")
                self.message_user(request, msg, level=messages.WARNING)
            if (
                obj.proxy_authentication_username or
                obj.proxy_authentication_password
            ):
                msg = _(
                    "API-AllowRequest Authentication will not use username nor password."
                )
                self.message_user(request, msg, level=messages.WARNING)

        return super().save_model(request, obj, form, change)
