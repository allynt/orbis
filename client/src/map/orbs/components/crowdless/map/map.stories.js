import * as React from 'react';

import isChromatic from 'chromatic/isChromatic';
import faker from '@faker-js/faker/locale/en_GB';

import CrowdlessMapComponent from './map.component';

if (isChromatic()) faker.seed(1);

const Index = {
  title: 'Orbs/Crowdless/CrowdlessMapComponent',
};

export default Index;

const Template = args => (
  <CrowdlessMapComponent
    feature={{
      properties: {
        name: faker.company.companyName(),
        address: [
          faker.address.streetAddress(),
          faker.address.city(),
          faker.address.zipCode(),
        ].join(', '),
        crowdednessScore: faker.random.number(100),
        ...args,
      },
    }}
  />
);

export const Category = Template.bind({});
Category.argTypes = {
  crowdednessCategory: {
    control: {
      type: 'inline-radio',
      options: ['not busy', 'busy', 'very busy'],
    },
    defaultValue: 'not busy',
  },
};

export const NoName = args => <CrowdlessMapComponent {...args} />;
NoName.args = {
  feature: {
    properties: {
      address: [
        faker.address.streetAddress(),
        faker.address.city(),
        faker.address.zipCode(),
      ].join(', '),
      crowdednessScore: faker.random.number(100),
    },
  },
};

export const NoAddress = args => <CrowdlessMapComponent {...args} />;
NoAddress.args = {
  feature: {
    properties: {
      name: faker.company.companyName(),
      crowdednessScore: faker.random.number(100),
    },
  },
};
