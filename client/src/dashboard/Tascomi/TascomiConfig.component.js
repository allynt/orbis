import React, { useState, useEffect } from 'react';

import { Tabs, Tab, styled } from '@astrosat/astrosat-ui';

import { useDispatch, useSelector } from 'react-redux';

import TabPanel from 'components/tab-panel.component';
import DashboardWrapper from 'dashboard/shared-components/dashboard-wrapper.component';

import { chartDataSelector, fetchDashboardData } from '../dashboard.slice';
import ProjectInfo from './project-info/project-info.component';
import Timeline from './timeline/timeline.component';

const LoadingMessage = styled('p')(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(4),
  textAlign: 'center',
}));

/**
 * @param {{
 *  visibleTab: number
 *  setVisibleTab: function
 * }} props
 */
const TascomiHeader = ({ visibleTab, setVisibleTab }) => (
  <Tabs value={visibleTab} onChange={(_event, value) => setVisibleTab(value)}>
    <Tab label="Project Info" value={1} />
    <Tab label="Timeline" value={2} />
  </Tabs>
);

const options = {
  datasetName: 'TascomiDashboardData',
  url: '/astrosat/wfc/tascomi/latest/',
  apiSourceId: 'astrosat/wfc/tascomi/latest',
};

const TascomiDashboard = ({ sourceId, applicationId }) => {
  const dispatch = useDispatch();
  const featuresData = useSelector(
    chartDataSelector(sourceId, options.datasetName),
  );
  const [visibleTab, setVisibleTab] = useState(1);

  useEffect(() => {
    if (!featuresData) {
      // @ts-ignore
      dispatch(fetchDashboardData({ sourceId, ...options }));
    }
  }, [dispatch, featuresData, sourceId]);

  const selectedFeature = featuresData?.properties.find(
    feature => feature['Application ID'] === +applicationId,
  );

  return (
    <DashboardWrapper
      isTabs
      HeaderComponent={
        <TascomiHeader visibleTab={visibleTab} setVisibleTab={setVisibleTab} />
      }
    >
      {!!selectedFeature ? (
        <>
          <TabPanel value={visibleTab} index={1}>
            <ProjectInfo selectedFeature={selectedFeature} />
          </TabPanel>
          <TabPanel value={visibleTab} index={2}>
            <Timeline timelineData={selectedFeature?.data} />
          </TabPanel>
        </>
      ) : (
        <LoadingMessage>Loading...</LoadingMessage>
      )}
    </DashboardWrapper>
  );
};

export default TascomiDashboard;
