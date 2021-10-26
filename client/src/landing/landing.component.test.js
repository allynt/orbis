import React from 'react';

import { ThemeProvider } from '@astrosat/astrosat-ui';

import fetch from 'jest-fetch-mock';

import { selectBookmark } from 'bookmarks/bookmarks.slice';
import { render, screen, userEvent } from 'test/test-utils';

import { regions } from '../map/map.constants';
import Landing from './landing.component';

const BOOKMARK_TEXT = 'Your Maps';

const TEST_BOOKMARKS = new Array(10).fill(undefined).map((_, i) => ({
  id: i,
  owner: `${i}e5ac533-0245-4031-ab65-b1eff4d30a1f`,
  title: `Bookmark Title ${i}`,
  description:
    'This is a description paragraph that describes the contents of this bookmark.',
  created: '2020-01-31T12:01:22.640053Z',
  thumbnail: 'test-image-URL',
}));

fetch.enableMocks();

const setup = newUser => {
  const bookmarks = newUser ? [] : TEST_BOOKMARKS;
  return render(
    <ThemeProvider>
      <Landing />
    </ThemeProvider>,
    {
      state: {
        bookmarks: {
          bookmarks,
        },
        map: {
          regions,
        },
        pollingPeriod: 3000,
        sources: null,
      },
      history: { initialEntries: ['/'] },
    },
  );
};

describe('<Landing />', () => {
  beforeEach(() => fetch.mockResponse(JSON.stringify({})));

  it('should render the No Bookmarks Landing view if the user has no bookmarks', () => {
    setup(true);

    expect(
      screen.getByText('Your Earth Observation journey starts here'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Browse Map' }),
    ).toBeInTheDocument();

    expect(screen.queryByText(BOOKMARK_TEXT)).not.toBeInTheDocument();
  });

  it('should render the Bookmarks Landing view', () => {
    setup();

    expect(screen.getByText(BOOKMARK_TEXT)).toBeInTheDocument();
    expect(screen.getByText('Browse Map')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'View all' }),
    ).toBeInTheDocument();

    expect(
      screen.queryByText('your Earth exploration journey starts here'),
    ).not.toBeInTheDocument();
  });

  it('Dispatches the selectBookmark action when a bookmark is clicked', () => {
    const { store } = setup();

    userEvent.click(screen.getByRole('button', { name: 'Bookmark Title 2' }));

    expect(store.getActions()).toContainEqual(
      expect.objectContaining({ type: selectBookmark.pending.type }),
    );
  });
});
