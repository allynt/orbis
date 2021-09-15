from astrosat_users.models import Customer as AstrosatUsersCustomer

from orbis.models import Licence


class LicencedCustomer(AstrosatUsersCustomer):
    """
    This is just a "proxy" model; it adds some methods for
    working with licences, but does not change the underlying
    model which still comes from astrosat_users.models
    """
    class Meta:
        verbose_name = "Customer"
        verbose_name_plural = "Customers"
        proxy = True

    @classmethod
    def cast(cls, customer):
        """
        Casts an instance of AstrosatUsersCustomer to LicencedCustomer, w/out
        requiring an extra db hit (as per https://stackoverflow.com/a/7923542/1060339)
        """
        assert isinstance(customer, AstrosatUsersCustomer)
        customer.__class__ = cls
        return customer

    def add_licences(self, orb, n, order_item=None):
        licences = []
        for _ in range(n):
            licence = Licence(customer=self, orb=orb, order_item=order_item)
            licence.save()
            licences.append(licence)
        return licences

    def assign_licences(
        self, orb, customer_users, add_missing=True, ignore_existing=True
    ):
        licences = []
        for customer_user in customer_users:
            existing_licences = self.licences.filter(orb=orb)
            assigned_licences = existing_licences.filter(
                customer_user=customer_user
            )
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

            # if there are any licences that are not exlusive, then remove all licences that are exclusive
            exclusive_licences = customer_user.licences.exclusive()
            if exclusive_licences.exists() and customer_user.licences.exclude(
                id__in=exclusive_licences.values("id")
            ):
                customer_user.licences.remove(*exclusive_licences)

            licences.append(licence)
        return licences
