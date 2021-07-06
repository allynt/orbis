import React from 'react';

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import SavedSearchList from './saved-search-list.component';

const savedSearches = [
  {
    id: 1,
    name: 'Test Search 1',
    start_date: '2000-01-01T00:00:00Z',
    end_date: '2000-01-01T01:00:00Z',
    tiers: ['free'],
  },
  {
    id: 2,
    name: 'Test Search 2',
    start_date: '2010-01-01T00:00:00Z',
    end_date: '2010-01-01T01:00:00Z',
    tiers: ['mid'],
  },
];

const renderComponent = () => {
  const onReloadClick = jest.fn();
  const onDeleteClick = jest.fn();
  const utils = render(
    <SavedSearchList
      // @ts-ignore
      savedSearches={savedSearches}
      onReloadClick={onReloadClick}
      onDeleteClick={onDeleteClick}
    />,
  );
  return { ...utils, onReloadClick, onDeleteClick };
};

describe('<SavedSearchList />', () => {
  it('Shows a list item for each search', () => {
    const { getAllByRole } = renderComponent();
    expect(getAllByRole('listitem')).toHaveLength(savedSearches.length);
  });

  it('Calls onReloadClick when the reload button is clicked', () => {
    const { getAllByRole, onReloadClick } = renderComponent();
    userEvent.click(getAllByRole('button', { name: 'Reload' })[0]);
    expect(onReloadClick).toBeCalledWith(savedSearches[0]);
  });

  it('Calls onDeleteClick when the delete button is clicked', () => {
    const { getAllByRole, onDeleteClick } = renderComponent();
    userEvent.click(getAllByRole('button', { name: 'Delete' })[1]);
    expect(onDeleteClick).toBeCalledWith(savedSearches[1]);
  });
});
