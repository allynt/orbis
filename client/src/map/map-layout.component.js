import React, { useEffect } from 'react';

import { Box } from '@astrosat/astrosat-ui';

import { ErrorBoundary } from 'react-error-boundary';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router';

import { AnalysisPanel } from 'analysis-panel/analysis-panel.component';
import { LoadMaskFallback } from 'components';
import { ToolbarFallback } from 'control-panel/toolbar-fallback.component';
import {
  fetchSources,
  selectPollingPeriod,
  dataSourcesSelector,
} from 'data-layers/data-layers.slice';
import { useDrawingTools } from 'drawing-tools';

import { ErrorFallback } from './error-fallback.component';
import { useOrbs } from './orbs/useOrbs';

const ControlPanel = React.lazy(() =>
  import(
    /* webpackChunkName: "ControlPanel" */ 'control-panel/control-panel.component'
  ),
);
const Map = React.lazy(() =>
  import(/* webpackChunkName: "Map" */ './map.component'),
);

const MissionControl = React.lazy(() =>
  import(
    /* webpackChunkName: "MissionControl" */ 'mission-control/mission-control.component'
  ),
);

const MapLayout = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { layers, mapComponents, sidebarComponents } = useOrbs();
  const drawingToolsProps = useDrawingTools();
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
        />
      </React.Suspense>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <React.Suspense fallback={<LoadMaskFallback />}>
          <Map
            layers={layers}
            mapComponents={mapComponents}
            {...drawingToolsProps}
          />
        </React.Suspense>
      </ErrorBoundary>
      <React.Suspense fallback={<LoadMaskFallback zIndex={4} />}>
        {location.pathname.includes('/mission-control') && <MissionControl />}
      </React.Suspense>
      <AnalysisPanel />
    </Box>
  );
};

export default MapLayout;
