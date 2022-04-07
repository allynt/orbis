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
  TableRow,
  Paper,
  Typography,
  TableHead,
  Grid,
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
  },
  body: {},
  box: {},
  grid: {
    border: '5px solid #333f48',
    borderRadius: '3px',
  },
  tabpanel: {
    width: '80%',
    height: '15rem',
  },
  '& .MuiTabs-scroller': {},
  table: {},
  row: {
    padding: 0,
    margin: '-1rem',
  },
  tab: {
    textAlign: 'left',
  },
  tabs: {
    backgroundColor: '#333f48',
    height: '15rem',
    border: 0,
    '& .MuiButtonBase-root.MuiTab-root': {
      width: '20%',
      maxWidth: '15rem',
      fontSize: 12,
    },
    '& .Mui-selected': {
      fontWeight: 800,
      color: 'white',
      marginTop: '1px',
      backgroundColor: theme.palette.background.paper,
    },
    '& .MuiTab-wrapper': {
      // the tab itself
      alignItems: 'start',
    },
    '& .MuiTabs-indicator': {
      // this is the animated tab stripe, dont want this
      border: '0px',
      display: 'none',
      backgroundColor: '#333f48',
    },
  },
  minus3: {
    color: '#f03b30',
    border: '1px solid #333f48',
  },
  minus2: {
    color: '#f67971',
    border: '1px solid #333f48',
  },
  minus1: {
    color: '#eda46c',
    border: '1px solid #333f48',
  },
  zero: {
    color: '#d8c06a',
    border: '1px solid #333f48',
  },
  plus1: {
    color: '#c7d99f',
    border: '1px solid #333f48',
  },
  plus2: {
    color: '#b3d567',
    border: '1px solid #333f48',
  },
  plus3: {
    color: '#7ef664',
    border: '1px solid #333f48',
  },
  headerone: {
    backgroundColor: '#3e4952',
    width: '25%',
    fontSize: '1.0rem',
  },
  headerother: {
    backgroundColor: '#3e4952',
    width: '18.75%',
    fontSize: '1.0rem',
  },
  tablecell: {
    width: '25%',
    border: '1px solid #333f48',
  },
}));

// This bit shows the impacts in the table to the right
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

  // strength table cell defined here
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
      info="This widget provides detailed impact information relating to your proposal."
    >
      {/* preamble */}
      <Typography variant="body1">
        The table below shows the impact of your proposal in more detail. Click
        a feature to see more information about the impacts on that feature.
      </Typography>
      {/* table headings */}
      <TableContainer component={Paper}>
        <Table className={styles.table}>
          <TableHead>
            <TableRow>
              <TableCell className={styles.headerone} align="left">
                Feature
              </TableCell>
              <TableCell className={styles.headerother} align="left">
                Activity
              </TableCell>
              <TableCell className={styles.headerother} align="left">
                Effect
              </TableCell>
              <TableCell className={styles.headerother} align="left">
                Strength
              </TableCell>
              <TableCell className={styles.headerother} align="left">
                Notifications
              </TableCell>
            </TableRow>
          </TableHead>
        </Table>
      </TableContainer>
      <Grid container className={styles.grid}>
        <div className={styles.root}>
          {/* tabs on the left, feature names */}
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={tab}
            onChange={toggleTab}
            aria-label="Impact details by feature"
            className={styles.tabs}
          >
            {mockdata.map(item => (
              <Tab key={item} className={styles.tab} label={item.name} />
            ))}
          </Tabs>
          {/* right-hand table rendered here, most negative first */}
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
                          <TableCell className={styles.tablecell}>
                            {impact.name}
                          </TableCell>
                          <TableCell className={styles.tablecell}>
                            {impact.effect}
                          </TableCell>
                          {getStrengthText(styles, impact.strength)}
                          <TableCell className={styles.tablecell}>
                            {impact.notification}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </TabPanel>
            );
          })}
        </div>
      </Grid>
    </ChartWrapper>
  );
};

export default ImpactFeatureDetailsNav;
