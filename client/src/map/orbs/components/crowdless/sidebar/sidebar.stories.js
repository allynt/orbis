import * as React from 'react';

import isChromatic from 'chromatic/isChromatic';
import faker from 'faker/locale/en_GB';

import { Description } from './description.component';
import { CrowdlessSidebarComponent } from './sidebar.component';

if (isChromatic()) faker.seed(1);

const Index = {
  title: 'Orbs/Crowdless/CrowdlessSidebarComponent',
  args: {
    visible: true,
  },
  argTypes: {
    onPageClick: { action: true },
  },
};

export default Index;

const Template = args => <CrowdlessSidebarComponent {...args} />;

export const NoResults = Template.bind({});

export const IsLoading = Template.bind({});
IsLoading.args = {
  isLoading: true,
};

export const Results = Template.bind({});
Results.args = {
  results: new Array(10).fill(undefined).map(() => ({
    properties: {
      crowdednessCategory: faker.random.arrayElement([
        'not busy',
        'busy',
        'very busy',
      ]),
      name: faker.company.companyName(),
      address: [
        faker.address.streetAddress(),
        faker.address.city(),
        faker.address.zipCode(),
      ].join(', '),
    },
  })),
};

export const ActiveResult = Template.bind({});
ActiveResult.args = {
  results: new Array(10).fill(undefined).map((_, i) => ({
    properties: {
      placeId: i,
      crowdednessCategory: faker.random.arrayElement([
        'not busy',
        'busy',
        'very busy',
      ]),
      name: faker.company.companyName(),
      address: [
        faker.address.streetAddress(),
        faker.address.city(),
        faker.address.zipCode(),
      ].join(', '),
    },
  })),
  selectedResult: { properties: { placeId: 2 } },
};

export const WithPages = Template.bind({});
WithPages.args = {
  ...ActiveResult.args,
  pages: 10,
  currentPage: 1,
};

export const DescriptionContent = () => <Description />;
