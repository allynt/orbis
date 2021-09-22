from django.contrib import admin
from django.utils.html import mark_safe

from astrosat.admin import ReadOnlyModelAdminBase

from orbis.models import OrderType, Order, OrderItem, Licence

###########
# inlines #
###########


class OrderItemAdminInline(ReadOnlyModelAdminBase, admin.TabularInline):
    # this is a readonly admin; as I only want to display the items not edit them
    model = OrderItem
    # TODO: I WANT TO SHOW EXPIRATION DETAILS HERE...
    fields = ("orb", "n_licences")
    readonly_fields = fields
    show_change_link = True
    extra = 0
    verbose_name_plural = mark_safe(
        "<b>Order Items:</b> <i>the individual Items belonging to this Order</i>"
    )


class LicenceAdminInline(ReadOnlyModelAdminBase, admin.TabularInline):
    # this is a readonly admin; as I only want to display the licences not edit them
    model = Licence
    fields = ("id", )
    readonly_fields = fields
    show_change_link = True
    extra = 0
    verbose_name_plural = mark_safe(
        "<b>Licences:</b> <i>the individual Licences created by this Item</i>"
    )


##########
# admins #
##########


@admin.register(OrderType)
class OrderTypeAdmin(admin.ModelAdmin):
    pass


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    actions = ("regenerate_report", )
    fields = (
        "uuid",
        "order_number",
        "created",
        "customer",
        "user",
        "order_type",
        "cost",
        "report",
    )
    inlines = (OrderItemAdminInline, )
    list_filter = ("customer", "created", "order_type")
    readonly_fields = ("uuid", "order_number", "created")

    def regenerate_report(self, request, queryset):
        for obj in queryset:
            obj.generate_report(force_save=True)

            msg = f"generated {obj.report}."
            self.message_user(request, msg)

    regenerate_report.short_description = "Regenerates the reports of the selected orders"


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    fields = (
        "id",
        "order",
        "subscription_period",
        "expiration",
        "is_expired",
        "cost",
        "orb",
        "n_licences",
    )
    inlines = (LicenceAdminInline, )
    list_display = ("order", "orb", "n_licences")
    list_filter = ("order", "orb")
    readonly_fields = ("id", "expiration", "is_expired")
