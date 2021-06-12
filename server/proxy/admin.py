from django.contrib import admin
from django.forms import Select, ModelForm

from astrosat.admin import JSONAdminWidget

from proxy.models import ProxyDataSource
from proxy.adapters import PROXY_DATA_ADAPTER_REGISTRY


class ProxyDataSourceAdminForm(ModelForm):
    """
    A custom Admin Form that makes the JSONField pretty and
    restricts the adapter name to only those adapters defined
    in the PROXY_DATA_ADAPTER_REGISTRY
    """
    class Meta:
        model = ProxyDataSource
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["proxy_params"].widget = JSONAdminWidget()
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
