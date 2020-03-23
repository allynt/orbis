import React from 'react';

import { render, cleanup, fireEvent, within } from '@testing-library/react';

import BookmarkList from './bookmarks-list.component';

describe('Bookmark List Component', () => {
  let bookmarks = null;
  let selectBookmark = null;
  let deleteBookmark = null;

  beforeEach(cleanup);

  beforeEach(() => {
    bookmarks = [
      {
        id: 1,
        title: 'Bookmark Title 1',
        description: 'Bookmark Description 1',
        thumbnail: 'Bookmark Thumbnail Image 1'
      },
      {
        id: 2,
        title: 'Bookmark Title 2',
        description: 'Bookmark Description 2',
        thumbnail: 'Bookmark Thumbnail Image 2'
      }
    ];
    selectBookmark = jest.fn();
    deleteBookmark = jest.fn();
  });

  it('should render the `No Bookmarks` message', () => {
    bookmarks = [];
    const { getByText } = render(
      <BookmarkList bookmarks={bookmarks} selectBookmark={selectBookmark} deleteBookmark={deleteBookmark} />
    );

    expect(getByText('No Bookmarks')).toBeInTheDocument();
  });

  it('should render a list of Bookmarks', () => {
    const { container, queryByText } = render(
      <BookmarkList bookmarks={bookmarks} selectBookmark={selectBookmark} deleteBookmark={deleteBookmark} />
    );

    const bookmarkItems = container.querySelectorAll('.bookmark');

    expect(bookmarkItems.length).toBe(2);

    bookmarkItems.forEach((bookmark, i) => {
      expect(within(bookmark).getByText(bookmarks[i].title)).toBeInTheDocument();
      expect(within(bookmark).getByText(bookmarks[i].description)).toBeInTheDocument();
      expect(within(bookmark).getByText('Load')).toBeInTheDocument();
      expect(within(bookmark).getByText('Delete')).toBeInTheDocument();
    });

    expect(queryByText('No Bookmarks')).not.toBeInTheDocument();
  });

  it('should set the selected bookmark when `Load` button clicked', () => {
    const { container } = render(
      <BookmarkList bookmarks={bookmarks} selectBookmark={selectBookmark} deleteBookmark={deleteBookmark} />
    );

    const bookmarkItem = container.querySelectorAll('.bookmark')[1];
    expect(selectBookmark).not.toHaveBeenCalled();
    fireEvent.click(within(bookmarkItem).getByText('Load'));
    expect(selectBookmark).toHaveBeenCalledWith(bookmarks[1]);
  });

  it('should delete the selected bookmark when `Delete` button clicked', () => {
    const { container } = render(
      <BookmarkList bookmarks={bookmarks} selectBookmark={selectBookmark} deleteBookmark={deleteBookmark} />
    );

    const bookmarkItem = container.querySelectorAll('.bookmark')[1];
    expect(deleteBookmark).not.toHaveBeenCalled();
    fireEvent.click(within(bookmarkItem).getByText('Delete'));
    expect(deleteBookmark).toHaveBeenCalledWith(bookmarks[1]);
  });
});
