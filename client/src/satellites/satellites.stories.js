import React from 'react';

import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { satellites } from './satellites-test-fixtures';
import Satellites from './satellites.component';

const mockStore = configureMockStore([thunk]);

export default { title: 'Satellites' };

const Template = args => (
  <Provider
    store={mockStore({
      satellites: {
        satellites,
      },
      app: { config: {} },
    })}
  >
    <Satellites {...args} />
  </Provider>
);

export const Default = Template.bind({});
Default.args = {};
