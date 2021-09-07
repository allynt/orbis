import * as React from 'react';

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import createMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { MapProvider } from 'MapContext';

import BookmarksPanel from './bookmarks-panel.component';
import { selectBookmark } from './bookmarks.slice';

const mockStore = createMockStore([thunk]);

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
    const { getByRole } = setup({
      accounts: { userKey: '' },
      bookmarks: { bookmarks: [] },
    });
    expect(getByRole('textbox', { name: 'Title' })).toBeInTheDocument();
    expect(getByRole('textbox', { name: 'Description' })).toBeInTheDocument();
  });

  it('shows a list of the bookmarks in state', () => {
    const initialState = {
      bookmarks: {
        bookmarks: [
          { id: '1', title: 'Bookmark 1' },
          { id: '2', title: 'Bookmark 2' },
        ],
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
        bookmarks: [{ id: '1', title: 'Bookmark 1' }],
      },
    };

    const testBookmark = initialState.bookmarks.bookmarks[0];
    const action = expect.objectContaining({
      type: selectBookmark.pending.type,
      meta: expect.objectContaining({
        arg: expect.objectContaining({
          bookmark: { id: testBookmark.id, title: testBookmark.title },
        }),
      }),
    });
    const { getByRole, store } = setup(initialState);
    userEvent.click(getByRole('button', { name: 'Load' }));
    expect(store.getActions()).toContainEqual(action);
  });
});
