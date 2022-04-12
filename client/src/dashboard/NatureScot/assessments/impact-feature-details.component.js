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

import { AddCircle, RemoveCircle } from '@material-ui/icons';

import { ChartWrapper } from 'dashboard/charts/chart-wrapper.component';
import data from 'dashboard/mock-data/NatureScot/activity-feature-mock';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    height: 'auto',
    padding: 0,
  },
  container: {
    height: '15rem',
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
    border: '5px solid #333f48',
    borderRadius: '3px',
  },
  tabpanel: {
    width: '80%',
    height: '15rem',
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
    backgroundColor: '#333f48',
    height: '15rem',
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
    fontSize: '0.8rem',
    border: '1px solid #333f48',
  },
}));

// This is a slightly modified version of TabPanel
const TablePanel = ({ value, index, children, ...rest }) => (
  <div role="tabpanel" hidden={value !== index} {...rest}>
    {value === index && (
      <Box sx={{ padding: 0 }} p={3}>
        {children}
      </Box>
    )}
  </div>
);

const ImpactFeatureDetails = () => {
  const styles = useStyles();

  const [tab, setTab] = useState(0);

  // strength table cell defined here. Showing rows of + or - icons
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
    let starArray = [];
    for (let i = 0; i < Math.abs(strength); i++) {
      starArray.push('*');
    }
    const strengthIndex = strength + 3;

    // custom SVG for neutral. Not ideal, but desired icon was not in v4 MUI...
    if (strength === 0) {
      return (
        <TableCell align="center" className={colorScale[strengthIndex]}>
          <svg
            version="1.1"
            width="20"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Shape</title>
            <g
              id="What's-the-Impact---User-Flows"
              transform="matrix(.041938 0 0 .041938 .027653 .15674)"
              fill="none"
              fill-rule="evenodd"
            >
              <path
                id="Shape"
                d="m238.47 476.9c-63.242 0-123.89-25.125-168.61-69.84-44.715-44.719-69.84-105.37-69.84-168.61s25.125-123.89 69.84-168.61c44.719-44.715 105.37-69.84 168.61-69.84s123.89 25.125 168.61 69.84c44.715 44.719 69.84 105.37 69.84 168.61-0.0586 63.223-25.203 123.84-69.906 168.54-44.707 44.703-105.32 69.848-168.54 69.91zm0-443.24v-0.0039c-40.516 0-80.125 12.016-113.81 34.527s-59.945 54.508-75.449 91.941c-15.5 37.438-19.555 78.625-11.645 118.36 7.9062 39.738 27.422 76.238 56.078 104.89 28.652 28.645 65.16 48.152 104.9 56.051 39.742 7.8945 80.93 3.832 118.36-11.684 37.43-15.512 69.422-41.777 91.922-75.469 22.504-33.695 34.508-73.309 34.496-113.82-0.0586-54.312-21.66-106.38-60.062-144.79-38.406-38.402-90.473-60.004-144.79-60.062z"
                fill="#d8c06a"
                fill-rule="nonzero"
              />
            </g>
          </svg>
        </TableCell>
      );
    }
    if (strength < 0) {
      return (
        <TableCell align="center" className={colorScale[strengthIndex]}>
          {starArray.map(item => (
            <RemoveCircle />
          ))}
        </TableCell>
      );
    } else {
      return (
        <TableCell align="center" className={colorScale[strengthIndex]}>
          {starArray.map(item => (
            <AddCircle />
          ))}
        </TableCell>
      );
    }
  };

  const getCell = value => {
    return <TableCell className={styles.tablecell}>{value}</TableCell>;
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
            {data.map(item => (
              <Tab key={item} className={styles.tab} label={item.name} />
            ))}
          </Tabs>
          {/* right-hand table rendered here, most negative first */}
          {data.map((item, index) => {
            const sortedImpacts = item.impacts.sort((a, b) =>
              a.strength >= b.strength ? 1 : -1,
            );
            const fields = sortedImpacts.map(impact => [
              getCell(impact.name),
              getCell(impact.effect),
              getStrengthText(styles, impact.strength),
              getCell(impact.notification),
            ]);
            return (
              <TablePanel
                key={item}
                value={tab}
                index={index}
                className={styles.tablepanel}
              >
                <TableContainer component={Paper} className={styles.container}>
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
