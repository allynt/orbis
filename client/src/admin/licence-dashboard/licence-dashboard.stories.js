import faker from 'faker/locale/en_GB';
import React from 'react';
import { LicenceDashboard } from './licence-dashboard.component';

export default {
  title: 'Admin/Licence Dashboard',
  component: LicenceDashboard,
};

const Template = args => <LicenceDashboard {...args} />;

const makeLicence = () => ({
  key: faker.commerce.department(),
  purchased: faker.random.number(10),
  available: faker.random.number(10),
  pending: faker.random.number(10),
  active: faker.random.number(10),
});

const reducer = (acc, { key, ...rest }) => ({ ...acc, [key]: { ...rest } });

export const NoLicences = Template.bind({});

export const Licences = Template.bind({});
Licences.args = {
  licenceInformation: Array(3)
    .fill(undefined)
    .map(makeLicence)
    .reduce(reducer, {}),
};

export const LotsOfLicences = Template.bind({});
LotsOfLicences.args = {
  licenceInformation: Array(50)
    .fill(undefined)
    .map(makeLicence)
    .reduce(reducer, {}),
};
