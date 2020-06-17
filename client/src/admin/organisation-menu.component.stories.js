import React from 'react';
import OrganisationMenu from './organisation-menu.component';

export default { title: 'Admin/Organisation Menu', component: OrganisationMenu };

const customer = {
  title: 'Cyberdyne Systems',
  logo: 'https://ichef.bbci.co.uk/images/ic/1200x675/p03t1sm8.jpg',
};

export const Default = () => <OrganisationMenu customer={customer} />;
