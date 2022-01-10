import { ThemeProvider } from '@astrosat/astrosat-ui';

import { rest } from 'msw';

import { selectBookmark } from 'bookmarks/bookmarks.slice';
import { server } from 'mocks/server';
import { render, screen, userEvent } from 'test/test-utils';

import { regions } from '../map/map.constants';
import Landing from './landing.component';

const BOOKMARK_TEXT = 'Your Maps';
const DASHBOARD_TEXT = 'Your Dashboards';

const TEST_BOOKMARKS = new Array(10).fill(undefined).map((_, i) => ({
  id: i,
  owner: `${i}e5ac533-0245-4031-ab65-b1eff4d30a1f`,
  title: `Bookmark Title ${i}`,
  description:
    'This is a description paragraph that describes the contents of this bookmark.',
  created: '2020-01-31T12:01:22.640053Z',
  thumbnail: 'test-image-URL',
}));

const TEST_DASHBOARD_SOURCES = new Array(2).fill(undefined).map((_, i) => ({
  source_id: `test/source_id/${i}`,
  metadata: {
    application: {
      orbis: {
        dashboard_component: {
          name: 'WalthamForest',
          title: `Dashboard Title ${i}`,
        },
      },
    },
  },
}));

const landingSetup = newUser => {
  const bookmarks = newUser ? [] : TEST_BOOKMARKS,
    sources = newUser ? [] : TEST_DASHBOARD_SOURCES;
  return render(
    <ThemeProvider>
      <Landing />
    </ThemeProvider>,
    {
      state: {
        bookmarks: {
          bookmarks,
        },
        data: {
          sources,
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
  beforeEach(() =>
    server.use(
      rest.get('*/api/data/sources', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({}));
      }),
    ),
  );

  it('should render the No Bookmarks Landing view if the user has no bookmarks or dashboards', () => {
    landingSetup(true);

    expect(
      screen.getByText('Your Earth Observation journey starts here'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Browse Map' }),
    ).toBeInTheDocument();

    expect(screen.queryByText(BOOKMARK_TEXT)).not.toBeInTheDocument();
  });

  it('should render the Content Landing view', () => {
    landingSetup();

    expect(screen.getByText(BOOKMARK_TEXT)).toBeInTheDocument();
    expect(screen.getByText(DASHBOARD_TEXT)).toBeInTheDocument();
    expect(screen.getByText('Browse Map')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'View all' }),
    ).toBeInTheDocument();

    expect(
      screen.queryByText('your Earth exploration journey starts here'),
    ).not.toBeInTheDocument();
  });

  it('Dispatches the selectBookmark action when a bookmark is clicked', () => {
    const { store } = landingSetup();

    userEvent.click(screen.getByRole('button', { name: 'Bookmark Title 2' }));

    expect(store.getActions()).toContainEqual(
      expect.objectContaining({ type: selectBookmark.pending.type }),
    );
  });

  // TODO: below test is broken

  xit('Navigates to dashboard route when dashboard is clicked', () => {
    const { history } = landingSetup();

    userEvent.click(screen.getByRole('button', { name: 'Dashboard Title 0' }));

    expect(history.location.pathname).toBe(
      '/dashboard?source_id=test/source_id/0',
    );
  });
});
