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
} from '@astrosat/astrosat-ui';

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
      {noData ? null : (
        <TableContainer className="mytable" component={Paper}>
          <Table className={styles.table}>
            <TableHead>
              <TableRow>
                <TableCell className={styles.header}>Activity</TableCell>
                <TableCell className={styles.header}>Aspect</TableCell>
                <TableCell className={styles.header}>Biodiversity</TableCell>
                <TableCell className={styles.header}>Chemical</TableCell>
                <TableCell className={styles.header}>People</TableCell>
                <TableCell className={styles.header}>
                  Soil, Water, Air
                </TableCell>
                <TableCell className={styles.header}>Environmental</TableCell>
                <TableCell className={styles.header}>Mitigations</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map(activity =>
                activity.impacts.map(item => (
                  <TableRow key={activity}>
                    <TableCell>{activity.title}</TableCell>
                    <TableCell>{item.title}</TableCell>
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
                    <TableCell>Mitigations etc...</TableCell>
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
