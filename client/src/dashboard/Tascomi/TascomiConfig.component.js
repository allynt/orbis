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
  const [selectedFeature, setSelectedFeature] = useState(null);

  useEffect(() => {
    if (!featuresData) {
      // @ts-ignore
      dispatch(fetchDashboardData({ sourceId, ...options }));
    }
  }, [dispatch, featuresData, sourceId]);

  useEffect(() => {
    if (!selectedFeature) {
      setSelectedFeature(
        featuresData?.properties.find(
          feature => feature['Application ID'] === +applicationId,
        ),
      );
    }
  }, [applicationId, featuresData, selectedFeature]);

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
        <p
          style={{
            width: '100%',
            padding: '2rem',
            textAlign: 'center',
          }}
        >
          {!featuresData
            ? 'Loading...'
            : 'No information found for this feature.'}
        </p>
      )}
    </DashboardWrapper>
  );
};

export default TascomiDashboard;
