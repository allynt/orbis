import React from 'react';

import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { render, fireEvent, within } from '@testing-library/react';

import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

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
  });

  const utils = render(
    <Router history={history}>
      <Provider store={store}>
        <Landing />
      </Provider>
    </Router>,
  );
  return { ...utils, history };
};

describe('Landing Component', () => {
  it('should render the New User Landing view', () => {
    const newUser = true;
    const { getByText, queryByText } = renderComponent(newUser);

    expect(
      getByText('Your Earth Observation journey starts here'),
    ).toBeInTheDocument();
    expect(getByText('Browse Map')).toBeInTheDocument();

    expect(queryByText(bookmarkText)).not.toBeInTheDocument();
    // expect(queryByText(storiesText)).not.toBeInTheDocument();
  });

  it('should render the Existing Landing view', () => {
    const { getByText, queryByText } = renderComponent();

    expect(getByText(bookmarkText)).toBeInTheDocument();
    // expect(getByText(storiesText)).toBeInTheDocument();
    expect(getByText('Browse Map')).toBeInTheDocument();
    expect(getByText('View all')).toBeInTheDocument();

    expect(
      queryByText('your Earth exploration journey starts here'),
    ).not.toBeInTheDocument();
  });

  it('does not render the `View all` button if the number of bookmarks is 4 or less', () => {
    const { queryByText } = renderComponent(false, 4);

    expect(queryByText('View all')).not.toBeInTheDocument();
  });

  it('should show all bookmarked maps when Bookmarks View all button clicked', () => {
    const { getByText, queryByText } = renderComponent();
    const yourMapsHeader = getByText(bookmarkText).parentElement;
    fireEvent.click(within(yourMapsHeader).getByText('View all'));

    expect(getByText('Back to menu')).toBeInTheDocument();
    expect(getByText('Browse Map')).toBeInTheDocument();
    expect(getByText('View All')).toBeInTheDocument();

    expect(queryByText(bookmarkText)).not.toBeInTheDocument();
  });

  it('should return to menu View when `Back to menu` button clicked', () => {
    const { getByText, queryByText } = renderComponent();

    const yourMapsHeader = getByText(bookmarkText).parentElement;
    fireEvent.click(within(yourMapsHeader).getByText('View all'));

    expect(getByText('Back to menu')).toBeInTheDocument();
    expect(getByText('Browse Map')).toBeInTheDocument();
    expect(getByText('View All')).toBeInTheDocument();

    expect(queryByText(bookmarkText)).not.toBeInTheDocument();

    fireEvent.click(getByText('Back to menu'));

    expect(getByText(bookmarkText)).toBeInTheDocument();
    expect(queryByText('View All')).not.toBeInTheDocument();
  });

  it('should transition to map when bookmarked map is clicked', () => {
    const { container, history } = renderComponent();

    const bookmarkedMaps = container.querySelectorAll('.items')[0];

    fireEvent.click(within(bookmarkedMaps).getByAltText('Bookmark Title 2'));

    expect(history.location.pathname).toBe('/map/{}');
  });

  // it('should show all stories when Stories View all button clicked', () => {
  //   const { getByText, queryByText } = render(
  //     <Provider store={store}>
  //       <Landing />
  //     </Provider>
  //   );
  //   const yourStoriesHeader = getByText(storiesText).parentElement;
  //   fireEvent.click(within(yourStoriesHeader).getByText('View all'));

  //   expect(getByText('Back to menu')).toBeInTheDocument();
  //   expect(getByText('Browse Map')).toBeInTheDocument();
  //   expect(getByText('View All')).toBeInTheDocument();

  //   expect(queryByText(storiesText)).not.toBeInTheDocument();
  // });

  // it('should return to menu View when `Back to menu` button clicked', () => {
  //   const { getByText, queryByText } = render(
  //     <Provider store={store}>
  //       <Landing />
  //     </Provider>
  //   );

  //   const yourStoriesHeader = getByText(storiesText).parentElement;
  //   fireEvent.click(within(yourStoriesHeader).getByText('View all'));

  //   expect(getByText('Back to menu')).toBeInTheDocument();
  //   expect(getByText('Browse Map')).toBeInTheDocument();
  //   expect(getByText('View All')).toBeInTheDocument();

  //   expect(queryByText(storiesText)).not.toBeInTheDocument();

  //   fireEvent.click(getByText('Back to menu'));

  //   expect(getByText(storiesText)).toBeInTheDocument();
  //   expect(queryByText('View All')).not.toBeInTheDocument();
  // });

  // it('should transition to map when story clicked', () => {
  //   const { container } = render(
  //     <Router history={history}>
  //       <Provider store={store}>
  //         <Landing />
  //       </Provider>
  //     </Router>
  //   );

  //   const stories = container.querySelectorAll('.items')[1];

  //   fireEvent.click(within(stories).getByAltText('Bookmark Title 2'));

  //   expect(history.location.pathname).toBe('/map/{}');
  // });
});
