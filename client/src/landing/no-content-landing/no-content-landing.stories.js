import * as React from 'react';

import { createBrowserHistory } from 'history';
import { Router } from 'react-router-dom';

import { NoContentLanding } from './no-content-landing.component';

export default {
  title: 'Landing/No Content Landing',
  decorators: [
    Story => (
      <Router history={createBrowserHistory()}>
        <Story />
      </Router>
    ),
  ],
};

export const Default = () => <NoContentLanding />;
