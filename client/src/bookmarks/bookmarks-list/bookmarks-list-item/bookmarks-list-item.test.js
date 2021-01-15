import * as React from 'react';

import { render } from '@testing-library/react';

import { BookmarksListItem } from './bookmarks-list-item.component';
import userEvent from '@testing-library/user-event';

const renderComponent = () => {
  const bookmark = {
    id: 1,
    title: 'Test Title',
    description: 'This is a test description',
  };
  const onSelect = jest.fn();
  const onDelete = jest.fn();
  const utils = render(
    <BookmarksListItem
      // @ts-ignore
      bookmark={bookmark}
      onSelect={onSelect}
      onDelete={onDelete}
    />,
  );
  return { bookmark, onSelect, onDelete, ...utils };
};

describe('<BookmarksListItem />', () => {
  it('Shows the bookmark title', () => {
    const { bookmark, getByText } = renderComponent();
    expect(getByText(bookmark.title)).toBeInTheDocument();
  });

  it('Shows the bookmark description', () => {
    const { bookmark, getByText } = renderComponent();
    expect(getByText(bookmark.description)).toBeInTheDocument();
  });

  it('Calls onSelect with the bookmark when the load button is clicked', () => {
    const { bookmark, getByRole, onSelect } = renderComponent();
    userEvent.click(getByRole('button', { name: /load/i }));
    expect(onSelect).toHaveBeenCalledWith(bookmark);
  });

  it('Calls onDelete with the bookmark when the delete button is clicked', () => {
    const { bookmark, getByRole, onDelete } = renderComponent();
    userEvent.click(getByRole('button', { name: /delete/i }));
    expect(onDelete).toHaveBeenCalledWith(bookmark);
  });
});
