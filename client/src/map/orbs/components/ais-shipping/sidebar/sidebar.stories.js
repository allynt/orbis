import * as React from 'react';

import { AisShippingSidebarComponent } from './sidebar.component';

const Index = {
  title: 'Orbs/AIS Shipping/AisShippingSidebarComponent',
  args: {
    visible: true,
  },
  argTypes: {
    onPageClick: { action: true },
  },
};

export default Index;

const Template = args => <AisShippingSidebarComponent {...args} />;

export const NoResults = Template.bind({});

export const IsLoading = Template.bind({});
IsLoading.args = {
  isLoading: true,
};

export const Results = Template.bind({});
Results.args = {
  results: new Array(10).fill(undefined).map(() => ({
    properties: {
      'Vessel Name': 'Test Vessel Name',
      'Vessel Call Sign': 'Test Vessel Call Sign',
      'Vessel Destination': 'Test Vessel Destination',
    },
  })),
};

export const ActiveResult = Template.bind({});
ActiveResult.args = {
  results: new Array(10).fill(undefined).map((_, i) => ({
    properties: {
      'Vessel Name': 'Test Vessel Name',
      'Vessel Call Sign': 'Test Vessel Call Sign',
      'Vessel Destination': 'Test Vessel Destination',
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
