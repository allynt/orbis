import React, { useState } from 'react';

import { Tabs, Tab, makeStyles } from '@astrosat/astrosat-ui';

import DashboardWrapper from 'dashboard/dashboard-wrapper.component';
import { TabPanel } from 'dashboard/NatureScot/tab-panel';

const TABS = {
  1: '1',
  2: '2',
};

const useStyles = makeStyles(theme => ({}));

/**
 * @param {{
 *  visibleTab: number
 *  setVisibleTab: function
 * }} props
 */
const TascomiHeader = ({ visibleTab, setVisibleTab }) => (
  <Tabs value={visibleTab} onChange={(_event, value) => setVisibleTab(value)}>
    <Tab label="Panel 1" value={TABS.one} />
    <Tab label="Panel 2" value={TABS.two} />
  </Tabs>
);

const TascomiDashboard = ({ sourceId }) => {
  const styles = useStyles({});
  const [visibleTab, setVisibleTab] = useState(0);
  return (
    <DashboardWrapper
      HeaderComponent={
        <TascomiHeader visibleTab={visibleTab} setVisibleTab={setVisibleTab} />
      }
    >
      <TabPanel value={visibleTab} index={0}>
        Panel 1
      </TabPanel>
      <TabPanel value={visibleTab} index={1}>
        Panel 2
      </TabPanel>
    </DashboardWrapper>
  );
};

export default TascomiDashboard;
