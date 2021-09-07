import React, { useEffect } from 'react';

import { Box } from '@astrosat/astrosat-ui';

import { useDispatch, useSelector } from 'react-redux';

import { AnalysisPanel } from 'analysis-panel/analysis-panel.component';
import {
  fetchSources,
  selectPollingPeriod,
  dataSourcesSelector,
} from 'data-layers/data-layers.slice';
import { useDrawingTools } from 'drawing-tools';
import { MissionControl } from 'mission-control/mission-control.component';

import ControlPanel from '../control-panel/control-panel.component';
import Map from './map.component';
import { useOrbs } from './orbs/useOrbs';

const MapLayout = () => {
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
      <ControlPanel
        sidebarComponents={sidebarComponents}
        drawingToolsEnabled={drawingToolsProps.drawingToolsEnabled}
      />
      <Map
        layers={layers}
        mapComponents={mapComponents}
        {...drawingToolsProps}
      />
      <MissionControl />
      <AnalysisPanel />
    </Box>
  );
};

export default MapLayout;
