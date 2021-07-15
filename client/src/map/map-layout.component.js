import React, { useEffect } from 'react';

import { Box } from '@astrosat/astrosat-ui';

import { useDispatch, useSelector } from 'react-redux';

import { AnalysisPanel } from 'analysis-panel/analysis-panel.component';
import {
  fetchSources,
  selectPollingPeriod,
} from 'data-layers/data-layers.slice';
import { useDrawingTools } from 'drawing-tools';
import { MissionControl } from 'mission-control/mission-control.component';
import { SatellitesProvider } from 'satellites/satellites-context';

import ControlPanel from '../control-panel/control-panel.component';
import Map from './map.component';
import { useOrbs } from './orbs/useOrbs';

const MapLayout = () => {
  const dispatch = useDispatch();
  const { layers, mapComponents, sidebarComponents } = useOrbs();
  const drawingToolsProps = useDrawingTools();
  const pollingPeriod = useSelector(selectPollingPeriod);

  useEffect(() => {
    // Poll API to get new Data token (expires every X seconds/mins etc)
    // this also fetches the list of data sources the user has access to.
    dispatch(fetchSources());
    const interval = setInterval(() => {
      dispatch(fetchSources());
    }, pollingPeriod);
    return () => {
      clearInterval(interval);
    };
  }, [pollingPeriod, dispatch]);

  return (
    <Box
      display="flex"
      width="100%"
      height="100vh"
      overflow="hidden"
      bgcolor="#242424"
    >
      <SatellitesProvider>
        <ControlPanel
          sidebarComponents={sidebarComponents}
          drawingToolsEnabled={drawingToolsProps.drawingToolsEnabled}
        />
        <Map
          layers={layers}
          mapComponents={mapComponents}
          {...drawingToolsProps}
        />
      </SatellitesProvider>
      <MissionControl />
      <AnalysisPanel />
    </Box>
  );
};

export default MapLayout;
