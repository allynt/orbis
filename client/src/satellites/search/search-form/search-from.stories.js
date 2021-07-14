import React from 'react';

import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

import SatelliteSearchForm from './search-form.component';

export default {
  title: 'Satellites/Search/SearchForm',
  argTypes: {
    onSubmit: { action: true },
    setVisiblePanel: { action: true },
    setSelectedMoreInfo: { action: true },
    toggleMoreInfoDialog: { action: true },
  },
};

const mockStore = configureMockStore();

const Template = args => (
  <Provider store={mockStore({ satellites: {}, app: { config: {} } })}>
    <SatelliteSearchForm {...args} />
  </Provider>
);

export const Default = Template.bind({});
Default.args = {};

export const WithSatellites = Template.bind({});
WithSatellites.args = {
  satellites: Array(5)
    .fill()
    .map((_, i) => ({ id: `sat${i}`, label: `Satellite ${i}` })),
};
