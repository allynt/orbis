import * as React from 'react';
import faker from 'faker/locale/en_GB';
import { CrowdlessSidebarComponent } from './sidebar.component';

export default {
  title: 'Orbs/IsolationPlus/Crowdless/CrowdlessSidebarComponent',
};

const Template = args => <CrowdlessSidebarComponent {...args} />;

export const NoResults = Template.bind({});

export const Results = Template.bind({});
Results.args = {
  results: new Array(10).fill(undefined).map(() => ({
    properties: {
      name: faker.company.companyName(),
      address: [
        faker.address.streetAddress(),
        faker.address.city(),
        faker.address.zipCode(),
      ].join(', '),
    },
  })),
};
