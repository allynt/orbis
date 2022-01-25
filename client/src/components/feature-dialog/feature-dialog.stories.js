import React from 'react';

import isChromatic from 'chromatic/isChromatic';
import faker from '@faker-js/faker/locale/en_GB';

import { FeatureDialog } from './feature-dialog.component';

if (isChromatic()) faker.seed(1);

export default { title: 'Components/Feature Dialog', args: { open: true } };

const Template = args => <FeatureDialog {...args} />;

export const Default = Template.bind({});

export const Feature = Template.bind({});
Feature.args = {
  feature: {
    properties: {
      Company: faker.company.companyName(),
      Address: faker.fake('{{address.streetAddress}}, {{address.city}}'),
      Telephone: faker.phone.phoneNumber(),
      Website: faker.internet.url(),
    },
  },
};

export const TitleProperty = Template.bind({});
TitleProperty.args = {
  ...Feature.args,
  titleProperty: 'Company',
};

export const Blacklist = Template.bind({});
Blacklist.args = {
  ...Feature.args,
  blacklist: ['Telephone', 'Company'],
};

export const Whitelist = Template.bind({});
Whitelist.args = {
  ...Feature.args,
  whitelist: ['Company', 'Telephone'],
};

export const FalsyContent = Template.bind({});
FalsyContent.args = {
  feature: {
    properties: {
      False: false,
      Zero: 0,
      Undefined: undefined,
      Null: null,
      EmptyString: '',
    },
  },
};
