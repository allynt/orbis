import React, { useState } from 'react';

import { FlyToInterpolator } from '@deck.gl/core';
import { useSelector } from 'react-redux';

import { useMap } from 'MapContext';
import { easeInOutCubic } from 'utils/easingFunctions';

import {
  fetchResults,
  isLoadingSelector,
  resultsSelector,
  setVisibility,
  visibilitySelector,
  selectedResultSelector,
  setSelectedResult,
} from '../slices/ais-shipping.slice';
import { AisShippingSidebarComponent } from './ais-shipping/sidebar/sidebar.component';

/**
 * @param {string} baseUrl
 * @param {number} p
 */
const makeUrl = (baseUrl, p = 1) => baseUrl.replace('{p}', p.toString());

/**
 * @param {{
 *   selectedLayer: import('typings').Source
 *   dispatch: import('redux').Dispatch
 * }} props
 */
const ConnectedWrapper = ({ selectedLayer, dispatch }) => {
  const { viewState, setViewState } = useMap();
  const [currentPage, setCurrentPage] = useState(1);
  const isLoading = useSelector(state => isLoadingSelector(state?.orbs));
  const visible = useSelector(state => visibilitySelector(state?.orbs));
  const results = useSelector(state => resultsSelector(state?.orbs));
  const selectedResult = useSelector(state =>
    selectedResultSelector(state?.orbs),
  );

  const handleFindClick = () => {
    setCurrentPage(1);
    dispatch(
      // @ts-ignore
      fetchResults({
        source: selectedLayer,
        url: makeUrl(selectedLayer.metadata.url),
      }),
    );
  };

  const handlePageClick = page => {
    setCurrentPage(page);

    dispatch(
      // @ts-ignore
      fetchResults({
        source: selectedLayer,
        url: makeUrl(selectedLayer.metadata.url, page),
      }),
    );
  };

  const handleRadioChange = () => dispatch(setVisibility(!visible));

  const handleResultClick = result => {
    dispatch(setSelectedResult(result));
    setViewState({
      ...viewState,
      longitude: result.geometry.coordinates[0],
      latitude: result.geometry.coordinates[1],
      zoom: 15,
      transitionDuration: 1000,
      transitionEasing: easeInOutCubic,
      transitionInterpolator: new FlyToInterpolator(),
    });
  };

  return (
    <AisShippingSidebarComponent
      onFindClick={handleFindClick}
      onRadioChange={handleRadioChange}
      isLoading={isLoading}
      results={results?.features}
      onPageClick={handlePageClick}
      currentPage={currentPage}
      pages={results?.pages}
      visible={visible}
      selectedResult={selectedResult}
      onResultClick={handleResultClick}
    />
  );
};

export default ConnectedWrapper;
