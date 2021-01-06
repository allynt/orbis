import React from 'react';

import { render, within } from '@testing-library/react';

import BookmarkList from './bookmarks-list.component';
import userEvent from '@testing-library/user-event';

const BOOKMARKS = [
  {
    id: 1,
    title: 'Bookmark Title 1',
    description: 'Bookmark Description 1',
    thumbnail: 'Bookmark Thumbnail Image 1',
  },
  {
    id: 2,
    title: 'Bookmark Title 2',
    description: 'Bookmark Description 2',
    thumbnail: 'Bookmark Thumbnail Image 2',
  },
];

const renderComponent = ({ bookmarks = BOOKMARKS } = {}) => {
  const onSelectBookmark = jest.fn();
  const onDeleteBookmark = jest.fn();
  const utils = render(
    <BookmarkList
      bookmarks={bookmarks}
      onSelectBookmark={onSelectBookmark}
      onDeleteBookmark={onDeleteBookmark}
    />,
  );
  return { onSelectBookmark, onDeleteBookmark, ...utils };
};

describe('Bookmark List Component', () => {
  it('should render the `No Bookmarks` message', () => {
    const { getByText } = renderComponent({ bookmarks: [] });

    expect(getByText('No Saved Maps')).toBeInTheDocument();
  });

  it('should render a list of Bookmarks', () => {
    const { getAllByRole, queryByText } = renderComponent();

    const bookmarkItems = getAllByRole('listitem');

    expect(bookmarkItems.length).toBe(2);

    bookmarkItems.forEach((bookmark, i) => {
      expect(
        within(bookmark).getByText(BOOKMARKS[i].title),
      ).toBeInTheDocument();
      expect(
        within(bookmark).getByText(BOOKMARKS[i].description),
      ).toBeInTheDocument();
      expect(within(bookmark).getByText('Load')).toBeInTheDocument();
      expect(within(bookmark).getByText('Delete')).toBeInTheDocument();
    });

    expect(queryByText('No Bookmarks')).not.toBeInTheDocument();
  });

  it('should set the selected bookmark when `Load` button clicked', () => {
    const { getAllByRole, onSelectBookmark } = renderComponent();

    expect(onSelectBookmark).not.toHaveBeenCalled();
    userEvent.click(
      within(getAllByRole('listitem')[1]).getByRole('button', { name: 'Load' }),
    );
    expect(onSelectBookmark).toHaveBeenCalledWith(BOOKMARKS[1]);
  });

  it('should delete the selected bookmark when `Delete` button clicked', () => {
    const { getAllByRole, onDeleteBookmark } = renderComponent();

    expect(onDeleteBookmark).not.toHaveBeenCalled();
    userEvent.click(
      within(getAllByRole('listitem')[1]).getByRole('button', {
        name: 'Delete',
      }),
    );
    expect(onDeleteBookmark).toHaveBeenCalledWith(BOOKMARKS[1]);
  });
});
