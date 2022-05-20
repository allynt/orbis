// activity impacts table

import React from 'react';

import {
  makeStyles,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  TableHead,
  Typography,
} from '@astrosat/astrosat-ui';

import {
  ChartWrapper,
  ChartWrapperSkeleton,
} from 'dashboard/charts/chart-wrapper.component';

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
  mayrequireconsent: {
    fontWeight: 800,
    textAlign: 'center',
  },
}));

const skeletonStyles = makeStyles(theme => ({
  areas: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    border: '5px solid #333f48',
    marginTop: '5rem',
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
      <Typography>
        The table below shows the impact of your proposal in more detail.
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
              {/* TODO: check this is correct */}
              {data.map(activity => (
                <TableRow key={activity.title}>
                  <TableCell>{activity.title}</TableCell>
                  <TableCell className={styles.mayrequireconsent}>
                    {activity?.operationMayRequireConsent ? 'Yes' : 'n/a'}
                  </TableCell>
                  {activity.summary.map(item => (
                    <ScoringDisplay
                      key={`${activity.title}_${item.category}`}
                      score={item.score}
                      legend={false}
                    />
                  ))}
                  <TableCell>
                    <ul>
                      {activity.possibleMitigations.map(item => (
                        <li className={styles.bulletpoint} key={item}>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </ChartWrapper>
  );
};

export const AssessmentActivityImpactsSkeleton = () => {
  const styles = skeletonStyles();

  return (
    <ChartWrapperSkeleton>
      <div className={styles.areas}>
        <Skeleton variant="rect" width={'100%'} height={'12rem'}>
          <Skeleton variant="text" width={'100%'} />
        </Skeleton>
        <Skeleton variant="rect" width={'100%'} height={'2rem'} />
        <Skeleton variant="rect" width={'100%'} height={'2rem'} />
        <Skeleton variant="rect" width={'100%'} height={'2rem'} />
        <Skeleton variant="rect" width={'100%'} height={'2rem'} />
      </div>
    </ChartWrapperSkeleton>
  );
};

export default AssessmentActivityImpacts;
