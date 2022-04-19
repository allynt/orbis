/* eslint-disable react/jsx-key */
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

import ImpactFeatureDetailsLegend from './impact-feature-details-legend';
import ScoringDisplay from './scoring-display';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    height: 'auto',
    padding: 0,
  },
  container: {
    height: '25rem',
    width: '100%',
    margin: 0,
    padding: 0,
  },
  body: {
    padding: 0,
  },
  box: {
    padding: 0,
  },
  tablepanel: {
    width: '80%',
  },
  grid: {
    border: '5px solid ' + theme.palette.secondary.main,
    borderRadius: '3px',
  },
  tabpanel: {
    width: '80%',
    height: '25rem',
    padding: 0,
  },
  '& .MuiTabs-scroller': {},
  table: {
    padding: 0,
  },
  row: {
    padding: 0,
    margin: 0,
  },
  tab: {
    textAlign: 'left',
  },
  tabs: {
    backgroundColor: theme.palette.background.paper,
    border: 0,
    '& .MuiButtonBase-root.MuiTab-root': {
      fontSize: 12,
    },
    '& .Mui-selected': {
      fontWeight: 800,
      color: 'white',
      marginTop: '1px',
      backgroundColor: theme.palette.background.paper,
      width: '100%',
    },
    '& .MuiTab-wrapper': {
      // the tab itself
      alignItems: 'start',
      width: '100%',
    },
    '& .MuiTabs-indicator': {
      // this is the animated tab stripe, dont want this
      border: '0px',
      width: 0,
      display: 'none',
      backgroundColor: theme.palette.background.paper,
    },
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
    fontSize: '0.8rem',
    border: `1px solid ${theme.palette.secondary.main}`,
  },
}));

// This is a slightly modified version of TabPanel
const TablePanel = ({ value, index, children, ...rest }) => (
  <div role="tabpanel" hidden={value !== index} {...rest}>
    {value === index && <Box sx={{ padding: 0 }}>{children}</Box>}
  </div>
);

const ImpactFeatureDetails = ({ data }) => {
  const styles = useStyles();
  const noData = !data;
  const actualData = data?.impacts;

  const [tab, setTab] = useState(0);

  const getCell = value => {
    return <TableCell className={styles.tablecell}>{value}</TableCell>;
  };

  const getScoreCell = value => <ScoringDisplay score={value} legend={false} />;

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
      <Grid direction="row" container>
        <Grid xs={2}>&nbsp;</Grid>
        <Grid xs={10}>
          <ImpactFeatureDetailsLegend />
        </Grid>
      </Grid>
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
            role="tab"
          >
            {noData
              ? null
              : actualData.map(item => (
                  <Tab key={item} className={styles.tab} label={item.name} />
                ))}
          </Tabs>
          {/* right-hand table rendered here, most negative first */}
          {noData
            ? null
            : actualData.map((item, index) => {
                const sortedImpacts = [...item.impacts].sort((a, b) =>
                  a.strength >= b.strength ? 1 : -1,
                );
                const fields = sortedImpacts.map(impact => [
                  getCell(impact.name),
                  getCell(impact.effect),
                  getScoreCell(impact.strength),
                  getCell(impact.notification),
                ]);
                return (
                  <TablePanel
                    key={item}
                    value={tab}
                    index={index}
                    className={styles.tablepanel}
                  >
                    <TableContainer
                      component={Paper}
                      className={styles.container}
                    >
                      <Table className={styles.table}>
                        <TableBody className={styles.body}>
                          {fields.map(row => {
                            return (
                              <TableRow key={row} className={styles.row}>
                                {row}
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </TablePanel>
                );
              })}
        </div>
      </Grid>
    </ChartWrapper>
  );
};

export default ImpactFeatureDetails;
