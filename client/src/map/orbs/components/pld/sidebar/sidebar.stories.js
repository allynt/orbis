import * as React from 'react';

import { PldSidebarComponent } from './sidebar.component';

export default {
  title: 'Orbs/PLD/SidebarComponent',
  args: {
    visible: true,
  },
  argTypes: {
    onPageClick: { action: true },
  },
};

const Template = args => <PldSidebarComponent {...args} />;

export const NoResults = Template.bind({});

export const IsLoading = Template.bind({});
IsLoading.args = {
  isLoading: true,
};

export const Results = Template.bind({});
Results.args = {
  results: new Array(10).fill(undefined).map(() => ({
    properties: {
      'Project ID': 'Test Project ID',
      Address: 'Test Address',
      'Development Type': 'Test Development Type',
    },
  })),
};

export const ActiveResult = Template.bind({});
ActiveResult.args = {
  results: new Array(10).fill(undefined).map((_, i) => ({
    properties: {
      'Project ID': 'Test Project ID',
      Address: 'Test Address',
      'Development Type': 'Test Development Type',
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
