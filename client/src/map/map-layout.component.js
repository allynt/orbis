import React, { useEffect } from 'react';

import { Box } from '@astrosat/astrosat-ui';

import { ErrorBoundary } from 'react-error-boundary';
import { useDispatch, useSelector } from 'react-redux';

import { AnalysisPanel } from 'analysis-panel/analysis-panel.component';
import { ErrorFallback, LoadMaskFallback } from 'components';
import { ToolbarFallback } from 'control-panel/toolbar-fallback.component';
import { useAoiLayer } from 'data-layers/aoi/useAoiLayer';
import {
  fetchSources,
  selectPollingPeriod,
  dataSourcesSelector,
  isCrossFilteringModeSelector,
  activeDataSourcesSelector,
  activeCrossFilterDataSourcesSelector,
} from 'data-layers/data-layers.slice';
import { useDrawingTools } from 'drawing-tools';

import { useOrbs } from './orbs/useOrbs';

const ControlPanel = React.lazy(() =>
  import(
    /* webpackChunkName: "ControlPanel" */ 'control-panel/control-panel.component'
  ),
);
const Map = React.lazy(() =>
  import(/* webpackChunkName: "Map" */ './map.component'),
);

const MapLayout = () => {
  const dispatch = useDispatch();
  const isCrossFilterMode = useSelector(isCrossFilteringModeSelector);

  const activeDataSources = useSelector(activeDataSourcesSelector);
  const activeCrossFilteringDataSources = useSelector(
    activeCrossFilterDataSourcesSelector,
  );
  const activeSources = isCrossFilterMode
    ? activeCrossFilteringDataSources
    : activeDataSources;

  const { layers, mapComponents, sidebarComponents } = useOrbs(activeSources);

  const drawingToolsProps = useDrawingTools();
  const aoiProps = useAoiLayer();
  const pollingPeriod = useSelector(selectPollingPeriod);
  const sources = useSelector(dataSourcesSelector);

  useEffect(() => {
    // Poll API to get new Data token (expires every X seconds/mins etc)
    // this also fetches the list of data sources the user has access to.
    if (!sources || sources.length === 0) {
      dispatch(fetchSources());
    }
    const interval = setInterval(() => {
      dispatch(fetchSources());
    }, pollingPeriod);
    return () => {
      clearInterval(interval);
    };
  }, [pollingPeriod, dispatch, sources]);

  return (
    <Box
      display="flex"
      width="100%"
      height="100vh"
      overflow="hidden"
      bgcolor="#242424"
    >
      <React.Suspense fallback={<ToolbarFallback />}>
        <ControlPanel
          sidebarComponents={sidebarComponents}
          drawingToolsEnabled={drawingToolsProps.drawingToolsEnabled}
          {...aoiProps}
        />
      </React.Suspense>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <React.Suspense fallback={<LoadMaskFallback />}>
          <Map
            layers={layers}
            mapComponents={mapComponents}
            {...drawingToolsProps}
            {...aoiProps}
          />
        </React.Suspense>
      </ErrorBoundary>
      <AnalysisPanel />
    </Box>
  );
};

export default MapLayout;
