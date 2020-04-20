import React from 'react';

import { render, cleanup, within, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { parseISO, format } from 'date-fns';

import { DATE_FORMAT, TIME_FORMAT } from './satellite.constants';

import Results from './results.component';

const mockeDialogRef = {
  current: document.body
};

const renderComponent = (
  scenes,
  setVisiblePanel,
  selectScene,
  setSelectedMoreInfo,
  toggleMoreInfoDialog,
  pinnedScenes,
  pinScene,
  deletePinnedScene,
  saveSatelliteSearch,
  currentSearchQuery
) =>
  render(
    <Results
      scenes={scenes}
      setVisiblePanel={setVisiblePanel}
      selectScene={selectScene}
      setSelectedMoreInfo={setSelectedMoreInfo}
      toggleMoreInfoDialog={toggleMoreInfoDialog}
      pinnedScenes={pinnedScenes}
      pinScene={pinScene}
      deletePinnedScene={deletePinnedScene}
      saveSatelliteSearch={saveSatelliteSearch}
      currentSearchQuery={currentSearchQuery}
      ref={mockeDialogRef}
    />
  );

describe('Satellite Results Component', () => {
  let scenes = null;
  let setVisiblePanel = null;
  let selectScene = null;
  let setSelectedMoreInfo = null;
  let toggleMoreInfoDialog = null;
  let pinnedScenes = null;
  let pinScene = null;
  let deletePinnedScene = null;
  let saveSatelliteSearch = null;
  let currentSearchQuery = null;

  beforeEach(cleanup);

  beforeEach(() => {
    scenes = [
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
        id: 2,
        cloudCover: 10.9,
        thumbnail_url: '/thumbnail.png',
        created: '2000-01-02T01:00:00Z'
      }
    ];
    setVisiblePanel = jest.fn();
    selectScene = jest.fn();
    setSelectedMoreInfo = jest.fn();
    toggleMoreInfoDialog = jest.fn();
    pinnedScenes = [];
    pinScene = jest.fn();
    deletePinnedScene = jest.fn();
    saveSatelliteSearch = jest.fn();
    currentSearchQuery = null;
  });

  it('should render a list of Scene results', () => {
    const { container, getByText, getByRole } = renderComponent(
      scenes,
      setVisiblePanel,
      selectScene,
      setSelectedMoreInfo,
      toggleMoreInfoDialog,
      pinnedScenes,
      pinScene,
      deletePinnedScene,
      saveSatelliteSearch,
      currentSearchQuery
    );

    const element = getByRole('slider');
    expect(getByText('CLOUD COVER %:')).toBeInTheDocument();
    expect(element).toBeInTheDocument();
    const defaultValue = '10';
    expect(within(element).getByText(defaultValue)).toBeInTheDocument();

    expect(getByText('RESULTS')).toBeInTheDocument();
    expect(getByText('Showing 2 Results')).toBeInTheDocument();

    const sceneElements = container.querySelectorAll('.scene');
    sceneElements.forEach((scene, i) => {
      expect(within(scene).getByText('pin.svg')).toBeInTheDocument();
      expect(within(scene).getByAltText('Thumbnail of a satellite scene')).toBeInTheDocument();
      expect(within(scene).getByText(format(parseISO(scenes[i].created), DATE_FORMAT))).toBeInTheDocument();
      expect(within(scene).getByText(`${format(parseISO(scenes[i].created), TIME_FORMAT)} UTC`)).toBeInTheDocument();
      expect(within(scene).getByText(scenes[i].cloudCover + ' %')).toBeInTheDocument();
      expect(within(scene).getByText('' + scenes[i].id)).toBeInTheDocument();
      expect(within(scene).getByText('More info')).toBeInTheDocument();
    });

    expect(getByText('Save Search')).toBeInTheDocument();
  });

  xit('should show no results when cloud cover filter too low', () => {
    const { debug, getByRole } = renderComponent(
      scenes,
      setVisiblePanel,
      selectScene,
      setSelectedMoreInfo,
      toggleMoreInfoDialog,
      pinnedScenes,
      pinScene,
      deletePinnedScene,
      saveSatelliteSearch,
      currentSearchQuery
    );

    const sliderElement = getByRole('slider').parentElement.parentElement;
    expect(sliderElement).toBeInTheDocument();
    const filterValue = '0';
    fireEvent.click(within(sliderElement).getByText(filterValue));
    // FIXME: Having problems changing the slider, so can't test list of results right now. Will look again at another point, spent ages on it.

    debug(sliderElement);
  });

  xit('should show results when cloud cover filter high enough', () => {});

  it('should pin scene when pin icon clicked', () => {
    const { getAllByText } = renderComponent(
      scenes,
      setVisiblePanel,
      selectScene,
      setSelectedMoreInfo,
      toggleMoreInfoDialog,
      pinnedScenes,
      pinScene,
      deletePinnedScene,
      saveSatelliteSearch,
      currentSearchQuery
    );

    fireEvent.click(getAllByText('pin.svg')[0]);
    expect(pinScene).toHaveBeenCalledWith(scenes[0]);
  });

  it('should delete pinned scene when already pinned pin icon clicked', () => {
    const { getAllByText } = renderComponent(
      scenes,
      setVisiblePanel,
      selectScene,
      setSelectedMoreInfo,
      toggleMoreInfoDialog,
      [{ ...scenes[0] }],
      pinScene,
      deletePinnedScene,
      saveSatelliteSearch,
      currentSearchQuery
    );

    fireEvent.click(getAllByText('pin.svg')[0]);
    expect(deletePinnedScene).toHaveBeenCalledWith(scenes[0].id);
  });

  it('should show dialog component when Save Search button clicked', () => {
    const { queryByText, getByText } = renderComponent(
      scenes,
      setVisiblePanel,
      selectScene,
      setSelectedMoreInfo,
      toggleMoreInfoDialog,
      [{ ...scenes[0] }],
      pinScene,
      deletePinnedScene,
      saveSatelliteSearch,
      currentSearchQuery
    );

    const dialogTitle = 'Name Search';
    expect(queryByText(dialogTitle)).toEqual(null);
    fireEvent.click(getByText('Save Search'));

    expect(getByText(dialogTitle)).toBeInTheDocument();
    expect(
      getByText('Please name your search. Find your saved searches alongside your saved AOIs under "Saved Searches"')
    ).toBeInTheDocument();
  });

  it('should disable Save Search button when Save Search form invalid', () => {
    const { getByText } = renderComponent(
      scenes,
      setVisiblePanel,
      selectScene,
      setSelectedMoreInfo,
      toggleMoreInfoDialog,
      [{ ...scenes[0] }],
      pinScene,
      deletePinnedScene,
      saveSatelliteSearch,
      currentSearchQuery
    );

    const buttonText = 'Save Search';
    fireEvent.click(getByText(buttonText));

    const dialogElement = getByText('Name Search').parentElement.parentElement;
    expect(within(dialogElement).getByText(buttonText)).toHaveAttribute('disabled');
  });

  it('should enable Save Search button when Save Search form valid', () => {
    const { getByText, getByPlaceholderText } = renderComponent(
      scenes,
      setVisiblePanel,
      selectScene,
      setSelectedMoreInfo,
      toggleMoreInfoDialog,
      [{ ...scenes[0] }],
      pinScene,
      deletePinnedScene,
      saveSatelliteSearch,
      currentSearchQuery
    );

    const buttonText = 'Save Search';
    fireEvent.click(getByText(buttonText));

    const dialogElement = getByText('Name Search').parentElement.parentElement;
    const textToEnter = 'Test Saved Satellite';
    userEvent.type(getByPlaceholderText('Name'), textToEnter);
    expect(within(dialogElement).getByText(buttonText)).not.toHaveAttribute('disabled');
  });

  it('should save search query when name entered and Save Search button clicked', () => {
    const { getByText, getByPlaceholderText } = renderComponent(
      scenes,
      setVisiblePanel,
      selectScene,
      setSelectedMoreInfo,
      toggleMoreInfoDialog,
      [{ ...scenes[0] }],
      pinScene,
      deletePinnedScene,
      saveSatelliteSearch,
      currentSearchQuery
    );

    const buttonText = 'Save Search';
    fireEvent.click(getByText(buttonText));

    const dialogElement = getByText('Name Search').parentElement.parentElement;
    const textToEnter = 'Test Saved Satellite';
    userEvent.type(getByPlaceholderText('Name'), textToEnter);
    fireEvent.click(within(dialogElement).getByText(buttonText));
    expect(saveSatelliteSearch).toHaveBeenCalledWith({ name: textToEnter });
  });
});
