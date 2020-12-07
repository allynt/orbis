import * as React from 'react';

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
} from '../slices/crowdless.slice';
import { CrowdlessSidebarComponent } from './crowdless/sidebar/sidebar.component';

/**
 * @param {{
 *   selectedLayer: Source
 *   dispatch: import('redux').Dispatch
 * }} props
 */
const ConnectedWrapper = ({ selectedLayer, dispatch }) => {
  const { viewState, setViewState } = useMap();
  const isLoading = useSelector(state => isLoadingSelector(state?.orbs));
  const visible = useSelector(state => visibilitySelector(state?.orbs));
  const results = useSelector(state => resultsSelector(state?.orbs));
  const selectedResult = useSelector(state =>
    selectedResultSelector(state?.orbs),
  );

  const handleFindClick = () => {
    dispatch(
      // @ts-ignore
      fetchResults({
        source: selectedLayer,
        url: selectedLayer.metadata.url
          .replace('{x}', viewState.latitude.toString())
          .replace('{y}', viewState.longitude.toString())
          .replace(
            '{r}',
            selectedLayer?.metadata?.application?.orbis?.sidebar_component
              ?.props?.searchRadius,
          ),
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
    <CrowdlessSidebarComponent
      onFindClick={handleFindClick}
      onRadioChange={handleRadioChange}
      isLoading={isLoading}
      results={results?.features}
      visible={visible}
      selectedResult={selectedResult}
      onResultClick={handleResultClick}
    />
  );
};

export default ConnectedWrapper;