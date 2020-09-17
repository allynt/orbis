import React from 'react';
import { Provider } from 'react-redux';
import store from 'store';
import Profile from './profile.component';

export default { title: 'Accounts/Profile' };

export const Default = () => (
  <Provider store={store}>
    <Profile />
  </Provider>
);
