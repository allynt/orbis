import React from 'react';

import OrganisationMenu from './organisation-menu.component';

export default {
  title: 'Admin/Organisation Menu',
  component: OrganisationMenu,
};

const customer = {
  name: 'Cyberdyne Systems',
  logo: 'https://www.logodesignlove.com/images/monograms/tesla-logo-01.jpg',
};

export const NoLogo = () => (
  <OrganisationMenu customer={{ name: customer.name }} />
);

export const Default = () => <OrganisationMenu customer={customer} />;
