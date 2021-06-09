import * as React from 'react';

import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import Landing from './landing.component';

const mockStore = configureMockStore([thunk]);
const history = createMemoryHistory({ initialEntries: ['/'] });

export default {
  title: 'Landing/Landing Pages',
};

const getStore = (bookmarks, n = 30) =>
  mockStore({
    bookmarks: {
      bookmarks: !bookmarks
        ? []
        : new Array(n).fill(undefined).map((_, i) => ({
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

const Template = ({ bookmarks, n }) => (
  <Provider store={getStore(bookmarks, n)}>
    <Router history={history}>
      <Landing />
    </Router>
  </Provider>
);

export const NoBookmarks = Template.bind({});
NoBookmarks.args = {
  bookmarks: false,
};

export const OnlyTwoBookmarks = Template.bind({});
OnlyTwoBookmarks.args = {
  bookmarks: true,
  n: 2,
};

export const LotsOfBookmarks = Template.bind({});
LotsOfBookmarks.args = {
  bookmarks: true,
};
