from django.utils.functional import classproperty

from astrosat_users.models import Customer as AstrosatUsersCustomer

from orbis.models import Licence


class LicencedCustomer(AstrosatUsersCustomer):
    """
    This is just a "proxy" model; it adds some methods for
    working with licences, but does not change the underlying
    model which still comes from astrosat_users.models
    """

    class Meta:
        # app_label = "astrosat_users"
        verbose_name = "Customer"
        verbose_name_plural = "Customers"
        proxy = True

    @classproperty
    def admin_url_basename(cls):
        # since this is a proxy model, the db_table that I usually use to generate admin URLs
        # won't change, but I _want_ to change it b/c I use a custom admin; this fn helps w/ that
        opts = cls._meta
        return f"{opts.app_label}_{opts.model_name}"

    def add_licences(self, orb, n):
        licences = []
        for _ in range(n):
            licence = Licence(customer=self, orb=orb)
            licence.save()
            licences.append(licence)
        return licences

    def assign_licences(self, orb, customer_users, add_missing=True, ignore_existing=True):
        licences = []
        for customer_user in customer_users:
            existing_licences = self.licences.filter(orb=orb)
            assigned_licences = existing_licences.filter(customer_user=customer_user)
            unassigned_licences = existing_licences.available()
            if assigned_licences.exists():
                assert ignore_existing, f"{self} already has a licence to {orb} assigned to {customer_user.user}."
                continue
            else:
                if unassigned_licences.exists():
                    licence = unassigned_licences[0]
                else:
                    assert add_missing, f"{self} has no unassigned licences available for {orb}."
                    licence = self.add_licences(orb, 1)[0]
                licence.customer_user = customer_user
                licence.save()
            licences.append(licence)
        return licences
