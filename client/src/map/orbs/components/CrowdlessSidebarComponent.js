import { useMap } from 'MapContext';
import * as React from 'react';
import { useSelector } from 'react-redux';
import {
  fetchResults,
  isLoadingSelector,
  resultsSelector,
  setVisibility,
  visibilitySelector,
} from '../slices/crowdless.slice';
import { CrowdlessSidebarComponent } from './crowdless/sidebar.component';

/**
 * @param {{
 *   selectedLayer: Source
 *   dispatch: import('redux').Dispatch
 * }} props
 */
const ConnectedWrapper = ({ selectedLayer, dispatch }) => {
  const { viewState } = useMap();
  const isLoading = useSelector(state => isLoadingSelector(state?.orbs));
  const visible = useSelector(state => visibilitySelector(state?.orbs));
  const results = useSelector(state => resultsSelector(state?.orbs));

  const handleFindClick = () =>
    dispatch(
      fetchResults(
        selectedLayer.metadata.url
          .replace('{x}', viewState.latitude.toString())
          .replace('{y}', viewState.longitude.toString())
          .replace(
            '{r}',
            selectedLayer?.metadata?.application?.orbis?.sidebar_component
              ?.props?.searchRadius,
          ),
      ),
    );

  const handleRadioChange = () => dispatch(setVisibility(!visible));

  return (
    <CrowdlessSidebarComponent
      onFindClick={handleFindClick}
      onRadioChange={handleRadioChange}
      isLoading={isLoading}
      results={results?.features}
      visible={visible}
    />
  );
};

export default ConnectedWrapper;
