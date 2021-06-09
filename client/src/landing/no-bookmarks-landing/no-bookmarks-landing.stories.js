import * as React from 'react';

import { createBrowserHistory } from 'history';
import { Router } from 'react-router-dom';

import { NoBookmarksLanding } from './no-bookmarks-landing.component';

export default {
  title: 'Landing/No Bookmarks Landing',
  decorators: [
    Story => (
      <Router history={createBrowserHistory()}>
        <Story />
      </Router>
    ),
  ],
};

export const Default = () => <NoBookmarksLanding />;
