from django.contrib import admin

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


class LicenceAdminInline(ReadOnlyModelAdminBase, admin.TabularInline):
    # this is a readonly admin; as I only want to display the licences not edit them
    model = Licence
    fields = ("id",)
    readonly_fields = fields
    show_change_link = True
    extra = 0


##########
# admins #
##########


@admin.register(OrderType)
class OrderTypeAdmin(admin.ModelAdmin):
    pass


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    fields = (
        "uuid",
        "order_number",
        "created",
        "customer",
        "user",
        "order_type",
        "cost",
        "order_form",
    )
    inlines = (OrderItemAdminInline,)
    list_filter = ("customer", "created", "order_type")
    readonly_fields = ("uuid", "order_number", "created")


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
    inlines = (LicenceAdminInline,)
    list_display = ("order", "orb", "n_licences")
    list_filter = ("order", "orb")
    readonly_fields = ("id", "expiration", "is_expired")
