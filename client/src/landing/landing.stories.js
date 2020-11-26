import * as React from 'react';

import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { createMemoryHistory } from 'history';

import Landing from './landing.component';

const mockStore = configureMockStore([thunk]);
const history = createMemoryHistory({ initialEntries: ['/'] });

export default {
  title: 'Landing Pages',
};

const getStore = bookmarks =>
  mockStore({
    bookmarks: {
      bookmarks: !bookmarks
        ? []
        : new Array(10).fill(undefined).map((_, i) => ({
            id: i,
            owner: `${i}e5ac533-0245-4031-ab65-b1eff4d30a1f`,
            title: `Bookmark ${i}`,
            description:
              'This is a description paragraph that describes the contents of this bookmark.',
            created: '2020-01-31T12:01:22.640053Z',
            zoom: 6.61084694352591,
            center: [-5.205274, 57.178733],
            feature_collection: { type: 'FeatureCollection', features: [] },
            thumbnail:
              'https://www.undiscoveredscotland.co.uk/usscotfax/geography/images/geography-450.jpg',
          })),
    },
  });

const Template = ({ bookmarks }) => (
  <Provider store={getStore(bookmarks)}>
    <Router history={history}>
      <Landing />
    </Router>
  </Provider>
);

export const NoBookmarks = Template.bind({});
NoBookmarks.args = {
  bookmarks: false,
};

export const Bookmarks = Template.bind({});
Bookmarks.args = {
  bookmarks: true,
};
