import React from 'react';

import { render, cleanup, within, fireEvent } from '@testing-library/react';

import { parseISO, format } from 'date-fns';

import { DATE_FORMAT, TIME_FORMAT } from './satellite.constants';

import ComparePins from './compare-pins.component';

const mockScenes = [
  {
    id: 1,
    label: 'Pinned Scene 1',
    created: '2000-01-01T00:00:00Z'
  },
  {
    id: 2,
    label: 'Pinned Scene 2',
    created: '2000-01-02T00:00:00Z'
  },
  {
    id: 3,
    label: 'Pinned Scene 3',
    created: '2000-01-03T00:00:00Z'
  }
];

const renderComponent = args => {
  const attributes = {
    setSelectedMoreInfo: jest.fn(),
    toggleMoreInfoDialog: jest.fn(),
    fetchPinnedScenes: jest.fn(),
    selectPinnedScene: jest.fn(),
    deselectPinnedScene: jest.fn(),
    clearSelectedPinnedScenes: jest.fn(),
    deletePinnedScene: jest.fn(),
    toggleCompareMode: jest.fn(),
    pinnedScenes: mockScenes,
    selectedPinnedScenes: [],
    isCompareMode: false,
    ...args
  };

  const testee = render(
    <ComparePins
      setSelectedMoreInfo={attributes.setSelectedMoreInfo}
      toggleMoreInfoDialog={attributes.toggleMoreInfoDialog}
      fetchPinnedScenes={attributes.fetchPinnedScenes}
      selectPinnedScene={attributes.selectPinnedScene}
      deselectPinnedScene={attributes.deselectPinnedScene}
      clearSelectedPinnedScenes={attributes.clearSelectedPinnedScenes}
      deletePinnedScene={attributes.deletePinnedScene}
      toggleCompareMode={attributes.toggleCompareMode}
      pinnedScenes={attributes.pinnedScenes}
      selectedPinnedScenes={attributes.selectedPinnedScenes}
      isCompareMode={attributes.isCompareMode}
    />
  );

  return { ...attributes, ...testee };
};

describe('Compare Pins Component', () => {
  beforeEach(cleanup);

  it('should render an empty list of pinned scenes', () => {
    const { container, getByText } = renderComponent({ pinnedScenes: [] });

    expect(getByText('Compare')).toBeInTheDocument();
    expect(getByText('Clear Pins')).toBeInTheDocument();
    expect(container.querySelector('li')).not.toBeInTheDocument();
  });

  it('should render a list of pinned scenes', () => {
    const { container } = renderComponent({});

    const pinnedSceneElements = container.querySelectorAll('.compareItem');
    expect(pinnedSceneElements.length).toEqual(mockScenes.length);
  });

  it('should fetch a list of pinned scenes, on first render', () => {
    const { fetchPinnedScenes } = renderComponent({ pinnedScenes: null });
    expect(fetchPinnedScenes).toHaveBeenCalled();
  });

  it('should render Compare Mode button disabled when not enough pinned scenes selected', () => {
    const { getByLabelText } = renderComponent({ selectedPinnedScenes: [{ ...mockScenes[1] }] });

    expect(getByLabelText('Compare')).toHaveAttribute('disabled');
  });

  it('should not be able to toggle Compare Mode when not enough pinned scenes selected', () => {
    const { toggleCompareMode, getByLabelText } = renderComponent({ selectedPinnedScenes: [{ ...mockScenes[1] }] });

    fireEvent.click(getByLabelText('Compare'));
    expect(toggleCompareMode).not.toHaveBeenCalled();
  });

  it('should toggle into Compare Mode when there are enough pinned scenes selected', () => {
    const { toggleCompareMode, getByLabelText } = renderComponent({
      selectedPinnedScenes: [mockScenes[0], mockScenes[1]]
    });

    expect(getByLabelText('Compare')).not.toHaveAttribute('disabled');
    fireEvent.click(getByLabelText('Compare'));
    expect(toggleCompareMode).toHaveBeenCalled();
  });

  it('should render Clear Pins button disabled', () => {
    const { getByText } = renderComponent();

    expect(getByText('Clear Pins')).toHaveAttribute('disabled');
  });

  it('should render Clear Pins button enabled', () => {
    const { getByText } = renderComponent({ selectedPinnedScenes: [{ ...mockScenes[2] }] });

    expect(getByText('Clear Pins')).not.toHaveAttribute('disabled');
  });

  it('should Clear selected pinned scenes', () => {
    const { clearSelectedPinnedScenes, getByText } = renderComponent({ selectedPinnedScenes: [{ ...mockScenes[2] }] });

    fireEvent.click(getByText('Clear Pins'));
    expect(clearSelectedPinnedScenes).toHaveBeenCalled();
  });

  it("should delete pinned scene, when scene's icon clicked", () => {
    const { deletePinnedScene, getByText } = renderComponent();

    const element = getByText('Pinned Scene 1').nextSibling;

    fireEvent.click(within(element).getByText('delete.svg'));
    expect(deletePinnedScene).toHaveBeenCalledWith(mockScenes[0].id);
  });

  it('should deselect pinned scene, when scene clicked and already selected', () => {
    const { deselectPinnedScene, getByText } = renderComponent({ selectedPinnedScenes: [{ ...mockScenes[0] }] });

    fireEvent.click(getByText('Pinned Scene 1').firstChild);

    expect(deselectPinnedScene).toHaveBeenCalledWith(mockScenes[0]);
  });

  it('should select pinned scene, when scene clicked and not already selected', () => {
    const { selectPinnedScene, getByText } = renderComponent();

    fireEvent.click(getByText('Pinned Scene 1').firstChild);

    expect(selectPinnedScene).toHaveBeenCalledWith(mockScenes[0]);
  });
});
