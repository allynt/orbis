import React, { useState } from 'react';

import {
  Box,
  Tab,
  Tabs,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  //TableHead,
  TableRow,
  Paper,
} from '@astrosat/astrosat-ui';

import { ChartWrapper } from 'dashboard/charts/chart-wrapper.component';
import mockdata from 'dashboard/mock-data/NatureScot/activity-feature-mock';
import { styles } from 'map-style/styles';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    height: 'auto',
  },
  container: {
    height: '15rem',
    margin: 0,
    padding: 0,
    overflowy: 'scroll',
  },
  body: {},
  box: {},
  tabpanel: {
    border: '1px solid red',
    overflow: 'scroll',
  },
  '& .MuiTabs-scroller': {
    border: '1px solid red',
    backgroundColor: '#f00',
  },
  table: {},
  row: {
    padding: 0,
    margin: '-1rem',
  },
  tabs: {
    backgroundColor: '#000',
    borderRight: `1px solid ${theme.palette.divider}`,
    border: '1px solid red',
    width: '15rem',
    fontSize: '0.5rem',
    '& .MuiButtonBase-root.MuiTab-root': {
      fontSize: 12,
    },

    '& .Mui-selected': {
      textDecoration: 'underline',
      backgroundColor: theme.palette.background.paper,
    },
  },
  minus3: {
    color: '#f03b30',
  },
  minus2: {
    color: '#f67971',
  },
  minus1: {
    color: '#eda46c',
  },
  zero: {
    color: '#d8c06a',
  },
  plus1: {
    color: '#c7d99f',
  },
  plus2: {
    color: '#b3d567',
  },
  plus3: {
    color: '#7ef664',
  },
}));

export const TabPanel = ({ value, index, children, ...rest }) => (
  <div
    role="tabpanel"
    className={styles.tabpanel}
    hidden={value !== index}
    {...rest}
  >
    {value === index && (
      <Box className={styles.box} sx={{ padding: 0 }} p={3}>
        {children}
      </Box>
    )}
  </div>
);

const ImpactFeatureDetailsNav = () => {
  const styles = useStyles();

  const [tab, setTab] = useState(0);

  const getStrengthText = (styles, strength) => {
    const colorScale = [
      styles.minus3,
      styles.minus2,
      styles.minus1,
      styles.zero,
      styles.plus1,
      styles.plus2,
      styles.plus3,
    ];
    const values = [
      'High -ve',
      'Medium -ve',
      'Low -ve',
      'Neutral',
      'Low +ve',
      'Medium +ve',
      'High +ve',
    ];
    const strengthIndex = strength + 3;
    return (
      // @ts-ignore
      <TableCell className={colorScale[strengthIndex]}>
        {values[strengthIndex]}
      </TableCell>
    );
  };

  const toggleTab = (event, tab) => setTab(tab);

  return (
    <ChartWrapper
      title="Impact Detail By Feature"
      info="Impact Detail By Feature Description"
    >
      <div className={styles.root}>
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={tab}
          onChange={toggleTab}
          aria-label="Impact details by feature"
          className={styles.tabs}
        >
          {mockdata.map(item => (
            <Tab key={item} label={item.name} />
          ))}
        </Tabs>

        {mockdata.map((item, index) => {
          const sortedImpacts = item.impacts.sort((a, b) =>
            a.strength >= b.strength ? 1 : -1,
          );
          return (
            <TabPanel
              key={item}
              value={tab}
              index={index}
              className={styles.tabpanel}
            >
              <TableContainer component={Paper} className={styles.container}>
                <Table className={styles.table}>
                  <TableBody className={styles.body}>
                    {sortedImpacts.map(impact => (
                      <TableRow key={impact} className={styles.row}>
                        <TableCell>{impact.name}</TableCell>
                        <TableCell>{impact.effect}</TableCell>
                        {getStrengthText(styles, impact.strength)}
                        <TableCell>{impact.notification}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </TabPanel>
          );
        })}
      </div>
    </ChartWrapper>
  );
};

export default ImpactFeatureDetailsNav;
