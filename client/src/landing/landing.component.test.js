import React from 'react';

import { ThemeProvider } from '@astrosat/astrosat-ui';

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { selectBookmark } from 'bookmarks/bookmarks.slice';
import { MapProvider } from 'MapContext';

import { regions } from '../map/map.constants';
import Landing from './landing.component';

const bookmarkText = 'Your Maps';
// const storiesText = 'Your Stories';

const mockStore = configureMockStore([thunk]);

const renderComponent = (newUser, n = 10) => {
  const history = createMemoryHistory({ initialEntries: ['/'] });
  const bookmarks = newUser
    ? []
    : new Array(n).fill(undefined).map((_, i) => ({
        id: i,
        owner: `${i}e5ac533-0245-4031-ab65-b1eff4d30a1f`,
        title: `Bookmark Title ${i}`,
        description:
          'This is a description paragraph that describes the contents of this bookmark.',
        created: '2020-01-31T12:01:22.640053Z',
        thumbnail: 'test-image-URL',
      }));

  const store = mockStore({
    bookmarks: {
      bookmarks,
    },
    map: {
      regions,
    },
    pollingPeriod: 3000,
    sources: null,
  });

  const utils = render(
    <Router history={history}>
      <Provider store={store}>
        <MapProvider>
          <ThemeProvider>
            <Landing />
          </ThemeProvider>
        </MapProvider>
      </Provider>
    </Router>,
  );
  return { ...utils, history, store };
};

describe('<Landing />', () => {
  beforeEach(() => fetch.mockResponse(JSON.stringify({})));

  it('should render the No Bookmarks Landing view if the user has no bookmarks', () => {
    const { getByText, getByRole, queryByText } = renderComponent(true);

    expect(
      getByText('Your Earth Observation journey starts here'),
    ).toBeInTheDocument();
    expect(getByRole('link', { name: 'Browse Map' })).toBeInTheDocument();

    expect(queryByText(bookmarkText)).not.toBeInTheDocument();
  });

  it('should render the Bookmarks Landing view', () => {
    const { getByText, getByRole, queryByText } = renderComponent();

    expect(getByText(bookmarkText)).toBeInTheDocument();
    expect(getByText('Browse Map')).toBeInTheDocument();
    expect(getByRole('button', { name: 'View all' })).toBeInTheDocument();

    expect(
      queryByText('your Earth exploration journey starts here'),
    ).not.toBeInTheDocument();
  });

  it('Dispatches the selectBookmark action when a bookmark is clicked', () => {
    const { getByRole, store } = renderComponent();

    userEvent.click(getByRole('button', { name: 'Bookmark Title 2' }));

    expect(store.getActions()).toContainEqual(
      expect.objectContaining({ type: selectBookmark.pending.type }),
    );
  });
});
