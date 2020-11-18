import { useMap } from 'MapContext';
import * as React from 'react';
import { CrowdlessSidebarComponent } from './crowdless/sidebar.component';

/**
 * @param {{
 *   selectedLayer: Source
 *   dispatch: import('redux').Dispatch
 * }} props
 */
const ConnectedWrapper = ({ selectedLayer, dispatch }) => {
  const { viewState } = useMap();

  const handleFindClick = () =>
    console.log(
      selectedLayer.metadata.url
        .replace('{x}', viewState.latitude.toString())
        .replace('{y}', viewState.longitude.toString())
        .replace('{r}', '30'),
    );

  return <CrowdlessSidebarComponent onFindClick={handleFindClick} />;
};

export default ConnectedWrapper;
