from django.urls import include, path

from astrosat.routers import SlashlessSimpleRouter

from .views import (
    LoginView,
    RegisterView,
    OrbListView,
    CustomerCreateView,
    CustomerUpdateView,
    CustomerUserListView,
    CustomerUserDetailView,
    CustomerUserInviteView,
    CustomerUserOnboardView,
    OrbisUserViewSet,
    OrbisUserFeedbackRecordView,
    DataSourceView,
    DocumentAgreementListView,
    DocumentDetailView,
    TokenView,
    OrderViewSet,
)

##############
# api routes #
##############

api_router = SlashlessSimpleRouter()
api_router.register(
    r"customers/(?P<customer_id>[^/.]+)/orders",
    OrderViewSet,
    basename="orders"
)
api_router.register(r"users", OrbisUserViewSet, basename="users")
api_urlpatterns = [
    # using custom login view to enable db logging...
    path("authentication/login/", LoginView.as_view(), name="rest_login"),
    # using custom register view to enable terms agreement...
    path("authentication/registration/", RegisterView.as_view(), name="rest_register"),
    path("orbs/", OrbListView.as_view(), name="orbs-list"),
    path("customers/", CustomerCreateView.as_view(), name="customers-list"),
    path("customers/<slug:customer_id>/", CustomerUpdateView.as_view(), name="customers-detail"),
    path("customers/<slug:customer_id>/users/", CustomerUserListView.as_view(), name="customer-users-list"),
    path("customers/<slug:customer_id>/users/<slug:user_id>/", CustomerUserDetailView.as_view(), name="customer-users-detail"),
    path("customers/<slug:customer_id>/users/<slug:user_id>/invite/", CustomerUserInviteView.as_view(), name="customer-users-invite"),
    path("customers/<slug:customer_id>/users/<slug:user_id>/onboard/", CustomerUserOnboardView.as_view(), name="customer-users-onboard"),
    path("users/<slug:id>/feedback/", OrbisUserFeedbackRecordView.as_view(), name="users-feedback"),
    path("data/sources/", DataSourceView.as_view(), name="datasources"),
    path("documents/agreements/", DocumentAgreementListView.as_view(), name="document-agreements"),
    path("documents/", DocumentDetailView.as_view(), name="documents"),
    path("data/token/", TokenView.as_view(), name="token"),
    path("", include(api_router.urls)),
]  # yapf: disable

#################
# normal routes #
#################

urlpatterns = []
