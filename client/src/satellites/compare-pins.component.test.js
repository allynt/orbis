import React from 'react';

import { render, cleanup, within, fireEvent } from '@testing-library/react';

import { parseISO, format } from 'date-fns';

import { DATE_FORMAT, TIME_FORMAT } from './satellite.constants';

import ComparePins from './compare-pins.component';

const renderComponent = (
  setSelectedMoreInfo,
  toggleMoreInfoDialog,
  fetchPinnedScenes,
  selectPinnedScene,
  deselectPinnedScene,
  clearSelectedPinnedScenes,
  deletePinnedScene,
  toggleCompareMode,
  pinnedScenes,
  selectedPinnedScenes,
  isCompareMode
) =>
  render(
    <ComparePins
      setSelectedMoreInfo={setSelectedMoreInfo}
      toggleMoreInfoDialog={toggleMoreInfoDialog}
      fetchPinnedScenes={fetchPinnedScenes}
      selectPinnedScene={selectPinnedScene}
      deselectPinnedScene={deselectPinnedScene}
      clearSelectedPinnedScenes={clearSelectedPinnedScenes}
      deletePinnedScene={deletePinnedScene}
      toggleCompareMode={toggleCompareMode}
      pinnedScenes={pinnedScenes}
      selectedPinnedScenes={selectedPinnedScenes}
      isCompareMode={isCompareMode}
    />
  );

describe('Compare Pins Component', () => {
  let setSelectedMoreInfo = null;
  let toggleMoreInfoDialog = null;
  let fetchPinnedScenes = null;
  let selectPinnedScene = null;
  let deselectPinnedScene = null;
  let clearSelectedPinnedScenes = null;
  let deletePinnedScene = null;
  let toggleCompareMode = null;
  let pinnedScenes = null;
  let selectedPinnedScenes = null;
  let isCompareMode = null;

  beforeEach(cleanup);

  beforeEach(() => {
    setSelectedMoreInfo = jest.fn();
    toggleMoreInfoDialog = jest.fn();

    fetchPinnedScenes = jest.fn();
    selectPinnedScene = jest.fn();
    deselectPinnedScene = jest.fn();
    clearSelectedPinnedScenes = jest.fn();
    deletePinnedScene = jest.fn();
    toggleCompareMode = jest.fn();
    pinnedScenes = [
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
    selectedPinnedScenes = [];
    isCompareMode = false;
  });

  it('should render an empty list of pinned scenes', () => {
    const { container, getByText } = renderComponent(
      setSelectedMoreInfo,
      toggleMoreInfoDialog,
      fetchPinnedScenes,
      selectPinnedScene,
      deselectPinnedScene,
      clearSelectedPinnedScenes,
      deletePinnedScene,
      toggleCompareMode,
      [],
      selectedPinnedScenes,
      isCompareMode
    );

    expect(getByText('Compare')).toBeInTheDocument();
    expect(getByText('Clear Pins')).toBeInTheDocument();
    expect(container.querySelector('li')).not.toBeInTheDocument();
  });

  it('should render a list of pinned scenes', () => {
    const { container } = renderComponent(
      setSelectedMoreInfo,
      toggleMoreInfoDialog,
      fetchPinnedScenes,
      selectPinnedScene,
      deselectPinnedScene,
      clearSelectedPinnedScenes,
      deletePinnedScene,
      toggleCompareMode,
      pinnedScenes,
      selectedPinnedScenes,
      isCompareMode
    );

    const pinnedSceneElements = container.querySelectorAll('.compareItem');
    pinnedSceneElements.forEach((scene, i) => {
      expect(within(scene).getByText(pinnedScenes[i].label)).toBeInTheDocument();
      expect(within(scene).getByText('delete.svg')).toBeInTheDocument();
      expect(within(scene).getByText(format(parseISO(pinnedScenes[i].created), DATE_FORMAT))).toBeInTheDocument();
      expect(
        within(scene).getByText(`${format(parseISO(pinnedScenes[i].created), TIME_FORMAT)} UTC`)
      ).toBeInTheDocument();
      expect(within(scene).getByText('delete.svg')).toBeInTheDocument();
      expect(within(scene).getByText('More info')).toBeInTheDocument();
    });
  });

  it('should fetch a list of pinned scenes, on first render', () => {
    renderComponent(
      setSelectedMoreInfo,
      toggleMoreInfoDialog,
      fetchPinnedScenes,
      selectPinnedScene,
      deselectPinnedScene,
      clearSelectedPinnedScenes,
      deletePinnedScene,
      toggleCompareMode,
      null,
      selectedPinnedScenes,
      isCompareMode
    );

    expect(fetchPinnedScenes).toHaveBeenCalled();
  });

  it('should render Compare Mode button disabled when not enough pinned scenes selected', () => {
    const { getByLabelText } = renderComponent(
      setSelectedMoreInfo,
      toggleMoreInfoDialog,
      fetchPinnedScenes,
      selectPinnedScene,
      deselectPinnedScene,
      clearSelectedPinnedScenes,
      deletePinnedScene,
      toggleCompareMode,
      pinnedScenes,
      [{ ...pinnedScenes[1] }],
      isCompareMode
    );

    expect(getByLabelText('Compare')).toHaveAttribute('disabled');
  });

  it('should not be able to toggle Compare Mode when not enough pinned scenes selected', () => {
    const { getByLabelText } = renderComponent(
      setSelectedMoreInfo,
      toggleMoreInfoDialog,
      fetchPinnedScenes,
      selectPinnedScene,
      deselectPinnedScene,
      clearSelectedPinnedScenes,
      deletePinnedScene,
      toggleCompareMode,
      pinnedScenes,
      [{ ...pinnedScenes[1] }],
      isCompareMode
    );

    fireEvent.click(getByLabelText('Compare'));
    expect(toggleCompareMode).not.toHaveBeenCalled();
  });

  it('should toggle into Compare Mode when there are enough pinned scenes selected', () => {
    const { getByLabelText } = renderComponent(
      setSelectedMoreInfo,
      toggleMoreInfoDialog,
      fetchPinnedScenes,
      selectPinnedScene,
      deselectPinnedScene,
      clearSelectedPinnedScenes,
      deletePinnedScene,
      toggleCompareMode,
      pinnedScenes,
      [pinnedScenes[0], pinnedScenes[0]],

      isCompareMode
    );

    expect(getByLabelText('Compare')).not.toHaveAttribute('disabled');
    fireEvent.click(getByLabelText('Compare'));
    expect(toggleCompareMode).toHaveBeenCalled();
  });

  it('should render Clear Pins button disabled', () => {
    const { getByText } = renderComponent(
      setSelectedMoreInfo,
      toggleMoreInfoDialog,
      fetchPinnedScenes,
      selectPinnedScene,
      deselectPinnedScene,
      clearSelectedPinnedScenes,
      deletePinnedScene,
      toggleCompareMode,
      pinnedScenes,
      selectedPinnedScenes,
      isCompareMode
    );

    expect(getByText('Clear Pins')).toHaveAttribute('disabled', '');
  });

  it('should render Clear Pins button enabled', () => {
    const { getByText } = renderComponent(
      setSelectedMoreInfo,
      toggleMoreInfoDialog,
      fetchPinnedScenes,
      selectPinnedScene,
      deselectPinnedScene,
      clearSelectedPinnedScenes,
      deletePinnedScene,
      toggleCompareMode,
      pinnedScenes,
      [{ ...pinnedScenes[2] }],
      isCompareMode
    );

    expect(getByText('Clear Pins')).not.toHaveAttribute('disabled', '');
  });

  it('should Clear selected pinned scenes', () => {
    const { getByText } = renderComponent(
      setSelectedMoreInfo,
      toggleMoreInfoDialog,
      fetchPinnedScenes,
      selectPinnedScene,
      deselectPinnedScene,
      clearSelectedPinnedScenes,
      deletePinnedScene,
      toggleCompareMode,
      pinnedScenes,
      [{ ...pinnedScenes[2] }],
      isCompareMode
    );

    fireEvent.click(getByText('Clear Pins'));
    expect(clearSelectedPinnedScenes).toHaveBeenCalled();
  });

  it("should delete pinned scene, when scene's icon clicked", () => {
    const { getByText } = renderComponent(
      setSelectedMoreInfo,
      toggleMoreInfoDialog,
      fetchPinnedScenes,
      selectPinnedScene,
      deselectPinnedScene,
      clearSelectedPinnedScenes,
      deletePinnedScene,
      toggleCompareMode,
      pinnedScenes,
      selectedPinnedScenes,
      isCompareMode
    );

    const element = getByText('Pinned Scene 1').nextSibling;

    fireEvent.click(within(element).getByText('delete.svg'));
    expect(deletePinnedScene).toHaveBeenCalledWith(pinnedScenes[0].id);
  });

  it('should deselect pinned scene, when scene clicked and already selected', () => {
    const { getByText } = renderComponent(
      setSelectedMoreInfo,
      toggleMoreInfoDialog,
      fetchPinnedScenes,
      selectPinnedScene,
      deselectPinnedScene,
      clearSelectedPinnedScenes,
      deletePinnedScene,
      toggleCompareMode,
      pinnedScenes,
      [{ ...pinnedScenes[0] }],
      isCompareMode
    );

    fireEvent.click(getByText('Pinned Scene 1').firstChild);

    expect(deselectPinnedScene).toHaveBeenCalledWith(pinnedScenes[0]);
  });

  it('should select pinned scene, when scene clicked and not already selected', () => {
    const { getByText } = renderComponent(
      setSelectedMoreInfo,
      toggleMoreInfoDialog,
      fetchPinnedScenes,
      selectPinnedScene,
      deselectPinnedScene,
      clearSelectedPinnedScenes,
      deletePinnedScene,
      toggleCompareMode,
      pinnedScenes,
      selectedPinnedScenes,
      isCompareMode
    );

    fireEvent.click(getByText('Pinned Scene 1').firstChild);

    expect(selectPinnedScene).toHaveBeenCalledWith(pinnedScenes[0]);
  });
});
