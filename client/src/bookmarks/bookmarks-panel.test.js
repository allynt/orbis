import * as React from 'react';

import { render, screen, userEvent } from 'test/test-utils';

import BookmarksPanel from './bookmarks-panel.component';
import { selectBookmark } from './bookmarks.slice';

describe('<BookmarksPanel />', () => {
  it('shows the new bookmark form', () => {
    render(<BookmarksPanel />, {
      state: {
        accounts: { userKey: '' },
        bookmarks: { bookmarks: [] },
      },
    });

    expect(screen.getByRole('textbox', { name: 'Title' })).toBeInTheDocument();
    expect(
      screen.getByRole('textbox', { name: 'Description' }),
    ).toBeInTheDocument();
  });

  it('shows a list of the bookmarks in state', () => {
    const state = {
      bookmarks: {
        bookmarks: [
          { id: '1', title: 'Bookmark 1' },
          { id: '2', title: 'Bookmark 2' },
        ],
      },
    };

    render(<BookmarksPanel />, { state });

    state.bookmarks.bookmarks
      .map(bm => bm.title)
      .forEach(title => {
        expect(screen.getByText(title)).toBeInTheDocument();
      });
  });

  it('calls the selectBookmark action', () => {
    const state = {
      bookmarks: {
        bookmarks: [{ id: '1', title: 'Bookmark 1' }],
      },
    };

    const testBookmark = state.bookmarks.bookmarks[0];

    const action = expect.objectContaining({
      type: selectBookmark.pending.type,
      meta: expect.objectContaining({
        arg: expect.objectContaining({
          bookmark: { id: testBookmark.id, title: testBookmark.title },
        }),
      }),
    });

    const { store } = render(<BookmarksPanel />, { state });

    userEvent.click(screen.getByRole('button', { name: 'Load' }));
    expect(store.getActions()).toContainEqual(action);
  });
});
