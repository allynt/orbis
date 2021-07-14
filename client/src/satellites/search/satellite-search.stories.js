import React from 'react';

import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import SatelliteSearch from './satellite-search.component';

const mockStore = configureMockStore([thunk]);

export default { title: 'Satellites/SatelliteSearch' };

const Template = args => (
  <Provider store={mockStore({ satellites: {}, app: { config: {} } })}>
    <SatelliteSearch {...args} />
  </Provider>
);

export const Default = Template.bind({});
Default.args = {};
