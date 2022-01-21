import React from 'react';

import isChromatic from 'chromatic/isChromatic';
import faker from '@faker-js/faker/locale/en_GB';

import { Subscriptions } from './subscriptions.component';

if (isChromatic()) faker.seed(1);

export default {
  title: 'Mission Control/Subscriptions',
  component: Subscriptions,
};

const Template = args => <Subscriptions {...args} />;

const makeLicence = () => ({
  key: faker.commerce.department(),
  purchased: faker.random.number(10),
  available: faker.random.number(10),
  pending: faker.random.number(10),
  active: faker.random.number(10),
});

const reducer = (acc, { key, ...rest }) => ({ ...acc, [key]: { ...rest } });

export const NoSubscriptions = Template.bind({});

export const SomeSubscriptions = Template.bind({});
SomeSubscriptions.args = {
  licenceInformation: Array(3)
    .fill(undefined)
    .map(makeLicence)
    .reduce(reducer, {}),
};

export const LotsOfSubscriptions = Template.bind({});
LotsOfSubscriptions.args = {
  licenceInformation: Array(50)
    .fill(undefined)
    .map(makeLicence)
    .reduce(reducer, {}),
};
