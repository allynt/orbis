import React from 'react';

import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { render, within, fireEvent, getByTitle } from '@testing-library/react';

import Results from './results.component';

const mockStore = configureMockStore([thunk]);

const mockeDialogRef = {
  current: document.body,
};

const mockScenes = [
  {
    id: '32UVD',
    cloudCover: 0.5,
    thumbnail_url: '/thumbnail.png',
    created: '2000-01-01T00:00:00Z',
  },
  {
    id: '323UVD',
    cloudCover: 0.9,
    thumbnail_url: '/thumbnail.png',
    created: '2000-01-02T01:00:00Z',
  },
  {
    id: '33UVD',
    cloudCover: 10.9,
    thumbnail_url: '/thumbnail.png',
    created: '2000-01-02T01:00:00Z',
  },
];

const renderComponent = (store, args) => {
  const attributes = {
    scenes: mockScenes,
    setVisiblePanel: jest.fn(),
    selectScene: jest.fn(),
    setSelectedMoreInfo: jest.fn(),
    toggleMoreInfoDialog: jest.fn(),
    pinnedScenes: mockScenes,
    pinScene: jest.fn(),
    deletePinnedScene: jest.fn(),
    saveSatelliteSearch: jest.fn(),
    currentSearchQuery: false,
    ...args,
  };
  const testee = render(
    <Provider store={store}>
      <Results
        scenes={attributes.scenes}
        setVisiblePanel={attributes.setVisiblePanel}
        selectScene={attributes.selectScene}
        setSelectedMoreInfo={attributes.setSelectedMoreInfo}
        toggleMoreInfoDialog={attributes.toggleMoreInfoDialog}
        pinnedScenes={attributes.pinnedScenes}
        pinScene={attributes.pinScene}
        deletePinnedScene={attributes.deletePinnedScene}
        saveSatelliteSearch={attributes.saveSatelliteSearch}
        currentSearchQuery={attributes.currentSearchQuery}
        ref={mockeDialogRef}
      />
    </Provider>,
  );

  return { ...attributes, ...testee };
};

describe.skip('Satellite Results Component', () => {
  let store = null;

  beforeEach(() => {
    store = mockStore({
      satellites: {
        visualisationId: 'TCI',
      },
    });
  });

  it('should render a list of Scene results', () => {
    const { container, getByText, getByRole } = renderComponent(store, {});

    const element = getByRole('slider');
    expect(getByText('CLOUD COVER %:')).toBeInTheDocument();
    expect(element).toBeInTheDocument();
    const defaultValue = '10';
    expect(within(element).getByText(defaultValue)).toBeInTheDocument();

    expect(getByText('RESULTS')).toBeInTheDocument();
    expect(getByText('Showing 2 Results of 3')).toBeInTheDocument();

    const sceneElements = container.querySelectorAll('.scene');
    expect(sceneElements.length).toEqual(2);

    expect(getByText('Save Search')).toBeInTheDocument();
  });

  it('should pin scene when pin icon clicked', () => {
    const { pinScene, getByTitle } = renderComponent(store, {
      pinnedScenes: [],
    });

    fireEvent.click(getByTitle(`pin-icon-${mockScenes[0].id}`));
    expect(pinScene).toHaveBeenCalledWith(mockScenes[0]);
  });

  it('should delete pinned scene when already pinned pin icon clicked', () => {
    const { deletePinnedScene, getByTitle } = renderComponent(store, {
      pinnedScenes: [{ ...mockScenes[0] }],
    });

    fireEvent.click(getByTitle(`pin-icon-${mockScenes[0].id}`));
    expect(deletePinnedScene).toHaveBeenCalledWith(mockScenes[0].id);
  });

  it('should show dialog component when Save Search button clicked', () => {
    const { queryByText, getByText } = renderComponent(store, {
      pinnedScenes: [{ ...mockScenes[0] }],
    });

    const dialogTitle = 'Name Search';
    expect(queryByText(dialogTitle)).toEqual(null);
    fireEvent.click(getByText('Save Search'));

    expect(getByText(dialogTitle)).toBeInTheDocument();
    expect(
      getByText(
        'Please name your search. Find your saved searches alongside your saved AOIs under "Saved Searches"',
      ),
    ).toBeInTheDocument();
  });
});
