import React, { useState, useEffect } from 'react';

import { Tabs, Tab } from '@astrosat/astrosat-ui';

import { useDispatch, useSelector } from 'react-redux';

import TabPanel from 'components/tab-panel.component';
import DashboardWrapper from 'dashboard/shared-components/dashboard-wrapper.component';

import { chartDataSelector, fetchDashboardData } from '../dashboard.slice';
import ProjectInfo from './project-info/project-info.component';
import Timeline from './timeline/timeline.component';

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

const url = '/wfc/mock/affordable_housing_delivery/v1';
const datasetName = 'test-name';
const apiSourceId = 'wfc/proxy/affordable_housing_delivery/latest';

const TascomiDashboard = ({ sourceId, applicationId }) => {
  const dispatch = useDispatch();
  const featureData = useSelector(chartDataSelector(sourceId, datasetName));
  const [visibleTab, setVisibleTab] = useState(1);

  useEffect(() => {
    if (!featureData) {
      // @ts-ignore
      dispatch(fetchDashboardData({ sourceId, datasetName, url, apiSourceId }));
    }
  }, [featureData]);

  return (
    <DashboardWrapper
      isTabs
      HeaderComponent={
        <TascomiHeader visibleTab={visibleTab} setVisibleTab={setVisibleTab} />
      }
    >
      <TabPanel value={visibleTab} index={1}>
        <ProjectInfo data={featureData} />
      </TabPanel>
      <TabPanel value={visibleTab} index={2}>
        <Timeline data={featureData} />
      </TabPanel>
    </DashboardWrapper>
  );
};

export default TascomiDashboard;
