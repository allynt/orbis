import * as React from 'react';
import faker from 'faker/locale/en_GB';
import { CrowdlessSidebarComponent } from './sidebar.component';
import { Description } from './description.component';

export default {
  title: 'Orbs/IsolationPlus/Crowdless/CrowdlessSidebarComponent',
  args: {
    visible: true,
  },
};

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

export const DescriptionContent = () => <Description />;
