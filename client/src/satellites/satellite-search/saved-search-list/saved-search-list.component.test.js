import React from 'react';

import { render, cleanup, fireEvent, within } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import SavedSearchList from './saved-search-list.component';

const mockStore = configureMockStore([thunk]);

describe('Saved Satellite Search List Component', () => {
  const store = mockStore({});

  let savedSearches = null;
  let setCurrentSearchQuery = null;
  let deleteSavedSatelliteSearch = null;

  beforeEach(cleanup);

  beforeEach(() => {
    savedSearches = [
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
    setCurrentSearchQuery = jest.fn();
    deleteSavedSatelliteSearch = jest.fn();
  });

  it('should render an empty list of searches when there are none', () => {
    savedSearches = [];
    const { queryByText } = render(
      <Provider store={store}>
        <SavedSearchList
          savedSearches={savedSearches}
          setCurrentSearchQuery={setCurrentSearchQuery}
          deleteSavedSatelliteSearch={deleteSavedSatelliteSearch}
        />
      </Provider>,
    );

    expect(queryByText('li')).toBeNull();
  });

  it('should render a list of searches when there are multiple', () => {
    const { getAllByRole } = render(
      <Provider store={store}>
        <SavedSearchList
          savedSearches={savedSearches}
          setCurrentSearchQuery={setCurrentSearchQuery}
          deleteSavedSatelliteSearch={deleteSavedSatelliteSearch}
        />
      </Provider>,
    );
    expect(getAllByRole('listitem')).toHaveLength(2);
  });

  it('should call `setCurrentSearchQuery` when `Reload` button clicked', () => {
    const { container } = render(
      <Provider store={store}>
        <SavedSearchList
          savedSearches={savedSearches}
          setCurrentSearchQuery={setCurrentSearchQuery}
          deleteSavedSatelliteSearch={deleteSavedSatelliteSearch}
        />
      </Provider>,
    );
    const searchItem = container.querySelectorAll('li')[0];
    fireEvent.click(within(searchItem).getByText('Reload'));
    expect(setCurrentSearchQuery).toHaveBeenCalledWith(savedSearches[0]);
  });

  it('should call `deleteSavedSatelliteSearch` when `Delete` button clicked', () => {
    const { container } = render(
      <Provider store={store}>
        <SavedSearchList
          savedSearches={savedSearches}
          setCurrentSearchQuery={setCurrentSearchQuery}
          deleteSavedSatelliteSearch={deleteSavedSatelliteSearch}
        />
      </Provider>,
    );
    const searchItem = container.querySelectorAll('li')[0];
    fireEvent.click(within(searchItem).getByText('Delete'));
    expect(deleteSavedSatelliteSearch).toHaveBeenCalledWith(
      savedSearches[0].id,
    );
  });
});
