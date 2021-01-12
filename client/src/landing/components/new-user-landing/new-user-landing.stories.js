import { createBrowserHistory } from 'history';
import * as React from 'react';
import { Router } from 'react-router-dom';
import { NewUserLanding } from './new-user-landing.component';

export default {
  title: 'Landing/New User Landing',
  decorators: [
    Story => (
      <Router history={createBrowserHistory()}>
        <Story />
      </Router>
    ),
  ],
};

export const Default = () => <NewUserLanding />;
