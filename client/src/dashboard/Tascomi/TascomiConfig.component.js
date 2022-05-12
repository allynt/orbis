import React, { useState } from 'react';

import { Tabs, Tab } from '@astrosat/astrosat-ui';

import DashboardWrapper from 'dashboard/shared-components/dashboard-wrapper.component';
import TabPanel from 'dashboard/shared-components/tab-panel.component';

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

const TascomiDashboard = ({ sourceId }) => {
  const [visibleTab, setVisibleTab] = useState(1);
  return (
    <DashboardWrapper
      isTabs
      HeaderComponent={
        <TascomiHeader visibleTab={visibleTab} setVisibleTab={setVisibleTab} />
      }
    >
      <TabPanel value={visibleTab} index={1}>
        <ProjectInfo />
      </TabPanel>
      <TabPanel value={visibleTab} index={2}>
        <Timeline />
      </TabPanel>
    </DashboardWrapper>
  );
};

export default TascomiDashboard;
