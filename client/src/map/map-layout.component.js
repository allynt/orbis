import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, ThemeProvider } from '@astrosat/astrosat-ui';

import { AnalysisPanel } from 'analysis-panel/analysis-panel.component';
import ControlPanel from '../control-panel/control-panel.component';
import {
  fetchSources,
  selectPollingPeriod,
} from 'data-layers/data-layers.slice';
import Map from './map.component';

const MapLayout = ({ history }) => {
  const dispatch = useDispatch();
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
      <ControlPanel />
      <Map />
      <AnalysisPanel history={history} />
    </Box>
  );
};

export default MapLayout;
