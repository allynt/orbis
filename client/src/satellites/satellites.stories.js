import React from 'react';

import faker from 'faker/locale/en_GB';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { SatellitesProvider } from './satellites-context';
import { satellites, scenes } from './satellites-test-fixtures';
import Satellites from './satellites.component';

const mockStore = configureMockStore([thunk]);

export default { title: 'Satellites' };

const Template = args => (
  <Provider
    store={mockStore({
      satellites: {
        satellites,
        scenes,
        selectedScene: scenes[0],
      },
      app: { config: {} },
    })}
  >
    <SatellitesProvider>
      <Satellites {...args} />
    </SatellitesProvider>
  </Provider>
);

export const Default = Template.bind({});
Default.args = {};
