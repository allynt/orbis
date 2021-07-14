import React from 'react';

import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import Search from './search.component';

const mockStore = configureMockStore([thunk]);

export default { title: 'Satellites/Search' };

const Template = args => (
  <Provider store={mockStore({ satellites: {}, app: { config: {} } })}>
    <Search {...args} />
  </Provider>
);

export const Default = Template.bind({});
Default.args = {};
