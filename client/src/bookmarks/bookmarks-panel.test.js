import React from 'react';
import { render } from '@testing-library/react';
import BookmarksPanel from './bookmarks-panel.component';
import { MapProvider } from 'MapContext';
import { Provider } from 'react-redux';
import createMockStore from 'redux-mock-store';
import userEvent from '@testing-library/user-event';
import { selectBookmark } from './bookmark.slice';

const mockStore = createMockStore();

const setup = (initialState = {}) => {
  const store = mockStore(initialState);
  const utils = render(
    <Provider store={store}>
      <MapProvider>
        <BookmarksPanel />
      </MapProvider>
    </Provider>,
  );
  return { ...utils, store };
};

describe('<BookmarksPanel />', () => {
  it('shows the new bookmark form', () => {
    const { getByLabelText } = setup({
      accounts: { userKey: '' },
      bookmarks: { bookmarks: [] },
    });
    expect(getByLabelText('Title')).toBeInTheDocument();
    expect(getByLabelText('Description')).toBeInTheDocument();
  });

  it('shows a list of the bookmarks in state', () => {
    const initialState = {
      bookmarks: {
        bookmarks: [{ title: 'Bookmark 1' }, { title: 'Bookmark 2' }],
      },
    };
    const { getByText } = setup(initialState);

    initialState.bookmarks.bookmarks
      .map(bm => bm.title)
      .forEach(title => {
        expect(getByText(title)).toBeInTheDocument();
      });
  });

  it('calls the selectBookmark action', () => {
    const initialState = {
      bookmarks: {
        bookmarks: [{ title: 'Bookmark 1' }],
      },
    };
    const action = {
      type: selectBookmark.type,
      payload: { title: initialState.bookmarks.bookmarks[0].title },
    };
    const { getByText, store } = setup(initialState);
    userEvent.click(getByText('Load'));
    expect(store.getActions()).toContainEqual(action);
  });
});
