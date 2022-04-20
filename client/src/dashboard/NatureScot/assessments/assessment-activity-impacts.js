// activity impacts table

import React from 'react';

import {
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  TableHead,
  Typography,
} from '@astrosat/astrosat-ui';

import { center } from '@turf/turf';

import { ChartWrapper } from 'dashboard/charts/chart-wrapper.component';

import ScoringDisplay from './scoring-display';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    height: 'auto',
    padding: 0,
  },
  header: {
    fontWeight: 800,
    textAlign: 'center',
  },
  headerActivity: {
    fontWeight: 800,
    textAlign: 'left',
  },
  headerMitigations: {
    width: '50%',
    textAlign: 'left',
    paddingLeft: '3.5rem',
    fontWeight: 800,
  },
  table: {
    padding: 0,
  },
  row: {
    padding: 0,
    margin: 0,
  },
  tablecell: {
    width: '25%',
    fontSize: '0.8rem',
    border: `1px solid ${theme.palette.secondary.main}`,
  },
  bulletpoint: {
    margin: '1rem',
  },
  mrc: {
    fontWeight: 800,
    textAlign: 'center',
  },
}));

const AssessmentActivityImpacts = ({ data }) => {
  // table
  const styles = useStyles();
  const noData = !data;
  return (
    <ChartWrapper
      title="Impact Detail By Activity"
      info="This widget provides detailed impact information relating to your proposal for each activity"
    >
      {/* preamble */}
      <Typography variant="body1">
        The table below shows the impact of your proposal in more detail. Click
        a feature to see more information about the impacts on that feature.
      </Typography>
      <br />
      {noData ? null : (
        <TableContainer component={Paper}>
          <Table className={styles.table}>
            <TableHead>
              <TableRow>
                <TableCell className={styles.headerActivity}>
                  Activity
                </TableCell>
                <TableCell className={styles.header}>
                  May require consent
                </TableCell>
                <TableCell className={styles.header}>Biodiversity</TableCell>
                <TableCell className={styles.header}>Chemical</TableCell>
                <TableCell className={styles.header}>People</TableCell>
                <TableCell className={styles.header}>
                  Soil, Water, Air
                </TableCell>
                <TableCell className={styles.header}>Environmental</TableCell>
                <TableCell className={styles.headerMitigations}>
                  Mitigations
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map(activity =>
                [activity.impacts[0]].map(item => (
                  <TableRow key={activity}>
                    <TableCell>{activity.title}</TableCell>
                    <TableCell className={styles.mrc}>
                      {activity?.operationMayRequireConsent ? 'Yes' : 'n/a'}
                    </TableCell>
                    <ScoringDisplay
                      score={item.impacts[0].score}
                      legend={false}
                    />
                    <ScoringDisplay
                      score={item.impacts[1].score}
                      legend={false}
                    />
                    <ScoringDisplay
                      score={item.impacts[2].score}
                      legend={false}
                    />
                    <ScoringDisplay
                      score={item.impacts[3].score}
                      legend={false}
                    />
                    <ScoringDisplay
                      score={item.impacts[4].score}
                      legend={false}
                    />
                    <TableCell>
                      {
                        <ul>
                          {activity.possibleMitigations.map(item => (
                            <li className={styles.bulletpoint} key={item}>
                              {item}
                            </li>
                          ))}
                        </ul>
                      }
                    </TableCell>
                  </TableRow>
                )),
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </ChartWrapper>
  );
};

export default AssessmentActivityImpacts;
