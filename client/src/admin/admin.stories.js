import * as React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Admin from './admin.component';

export default { title: 'Admin/Main' };

const mockStore = configureMockStore([thunk]);

const Template = args => (
  <Provider store={mockStore({ admin: {} })}>
    <Admin />
  </Provider>
);

export const Default = Template.bind({});
