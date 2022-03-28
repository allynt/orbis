import React, { useState } from 'react';

import { Box, Tab, Tabs, makeStyles } from '@astrosat/astrosat-ui';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    height: 224,
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

export const TabPanel = ({ value, index, children, ...rest }) => (
  <div role="tabpanel" hidden={value !== index} {...rest}>
    {value === index && <Box p={3}>{children}</Box>}
  </div>
);

const ImpactFeatureDetailsNav = () => {
  const styles = useStyles();

  const [tab, setTab] = useState(0);

  const toggleTab = (event, tab) => setTab(tab);

  return (
    <div className={styles.root}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={tab}
        onChange={toggleTab}
        aria-label="Impact details by feature"
        className={styles.tabs}
      >
        <Tab label="Item One" />
        <Tab label="Item Two" />
        <Tab label="Item Three" />
      </Tabs>

      <TabPanel value={tab} index={0}>
        Item Content One
      </TabPanel>
      <TabPanel value={tab} index={1}>
        Item Content Two
      </TabPanel>
      <TabPanel value={tab} index={2}>
        Item Content Three
      </TabPanel>
    </div>
  );
};

export default ImpactFeatureDetailsNav;
