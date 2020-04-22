import React from 'react';

import { render, within, fireEvent } from '@testing-library/react';

import Results from './results.component';

const mockeDialogRef = {
  current: document.body
};

const mockScenes = [
  {
    id: 1,
    cloudCover: 0.5,
    thumbnail_url: '/thumbnail.png',
    created: '2000-01-01T00:00:00Z'
  },
  {
    id: 2,
    cloudCover: 0.9,
    thumbnail_url: '/thumbnail.png',
    created: '2000-01-02T01:00:00Z'
  },
  {
    id: 3,
    cloudCover: 10.9,
    thumbnail_url: '/thumbnail.png',
    created: '2000-01-02T01:00:00Z'
  }
];

const renderComponent = args => {
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
    ...args
  };
  const testee = render(
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
  );

  return { ...attributes, ...testee };
};

describe('Satellite Results Component', () => {
  it('should render a list of Scene results', () => {
    const { container, getByText, getByRole } = renderComponent({});

    const element = getByRole('slider');
    expect(getByText('CLOUD COVER %:')).toBeInTheDocument();
    expect(element).toBeInTheDocument();
    const defaultValue = '10';
    expect(within(element).getByText(defaultValue)).toBeInTheDocument();

    expect(getByText('RESULTS')).toBeInTheDocument();
    expect(getByText('Showing 2 Results')).toBeInTheDocument();

    const sceneElements = container.querySelectorAll('.scene');
    expect(sceneElements.length).toEqual(2);

    expect(getByText('Save Search')).toBeInTheDocument();
  });

  it('should pin scene when pin icon clicked', () => {
    const { pinScene, getAllByText } = renderComponent({ pinnedScenes: [] });

    fireEvent.click(getAllByText('pin.svg')[0]);
    expect(pinScene).toHaveBeenCalledWith(mockScenes[0]);
  });

  it('should delete pinned scene when already pinned pin icon clicked', () => {
    const { deletePinnedScene, getAllByText } = renderComponent({ pinnedScenes: [{ ...mockScenes[0] }] });

    fireEvent.click(getAllByText('pin.svg')[0]);
    expect(deletePinnedScene).toHaveBeenCalledWith(mockScenes[0].id);
  });

  it('should show dialog component when Save Search button clicked', () => {
    const { queryByText, getByText } = renderComponent({ pinnedScenes: [{ ...mockScenes[0] }] });

    const dialogTitle = 'Name Search';
    expect(queryByText(dialogTitle)).toEqual(null);
    fireEvent.click(getByText('Save Search'));

    expect(getByText(dialogTitle)).toBeInTheDocument();
    expect(
      getByText('Please name your search. Find your saved searches alongside your saved AOIs under "Saved Searches"')
    ).toBeInTheDocument();
  });
});
