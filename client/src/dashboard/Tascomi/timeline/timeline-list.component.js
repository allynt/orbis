import React, { useState } from 'react';

import {
  Collapse,
  Grid,
  List,
  ListItem,
  Skeleton,
  TriangleIcon,
  Typography,
  makeStyles,
} from '@astrosat/astrosat-ui';

import clsx from 'clsx';

import { ChartWrapper } from 'dashboard/charts/chart-wrapper.component';
import { formatDate } from 'utils/dates';

const useStyles = makeStyles(theme => ({
  chartWrapper: {
    backgroundColor: theme.palette.background.default,
    boxShadow: 'unset',
  },
  referenceNumber: {
    color: theme.palette.primary.light,
  },
  timeline: {
    margin: `${theme.spacing(2)} 0`,
  },
  listItem: {
    backgroundColor: '#4e5d65',
    borderRadius: '0.3rem',
    '&:hover': {
      backgroundColor: '#4e5d65',
    },
  },
  icon: {
    fontSize: 'inherit',
    marginRight: theme.spacing(1),
    transform: 'rotate(90deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shorter,
      easing: theme.transitions.easing.sharp,
    }),
    '&$open': {
      transform: 'rotate(180deg)',
    },
  },
  open: {},
  strapline: {
    marginTop: theme.spacing(2),
  },
  additionalFields: {
    position: 'relative',
    top: '-0.5rem',
    padding: `${theme.spacing(2)} 0 ${theme.spacing(2)} ${theme.spacing(2)}`,
    backgroundColor: '#4e5d65',
    borderBottomLeftRadius: '0.3rem',
    borderBottomRightRadius: '0.3rem',
  },
}));

const skeletonStyles = makeStyles(theme => ({
  areas: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  bar: {
    height: '8rem',
    width: '100%',
  },
}));

const NO_TIMELINE_DATA = 'No timeline data';
const NO_DATE = 'No date available';
const NO_FIELD = 'Not available';

const formatAdditionalField = (key, value) => {
  return !value
    ? NO_FIELD
    : key.match(/date/i)
    ? formatDate(new Date(value))
    : value;
};

const TimeLineListItem = ({ onClick, openSections, title, listItem }) => {
  const styles = useStyles();

  const date = listItem.Date ? formatDate(new Date(listItem.Date)) : NO_DATE;
  const hasAdditionalFields =
    listItem.additional_fields &&
    Object.keys(listItem.additional_fields).length > 0;

  return (
    <ListItem
      button
      onClick={onClick}
      className={styles.listItem}
      role="listitem"
    >
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h4">{title}</Typography>
        </Grid>
        <Grid className={styles.strapline} item xs={6}>
          <Typography
            variant="h4"
            component="span"
          >{`${listItem['Date Type']}: `}</Typography>
          <Typography component="span">{date}</Typography>
        </Grid>
        <Grid className={styles.strapline} item xs={5}>
          <Typography variant="h4" component="span">
            Source:{' '}
          </Typography>
          <Typography component="span">{listItem.Source}</Typography>
        </Grid>

        <Grid item xs={1}>
          {hasAdditionalFields ? (
            openSections.includes(title) ? (
              <TriangleIcon
                className={clsx(styles.icon, { [styles.open]: true })}
                role="opensection"
                aria-hidden="false"
              />
            ) : (
              <TriangleIcon
                className={clsx(styles.icon, { [styles.open]: false })}
                role="closedsection"
                aria-hidden="false"
              />
            )
          ) : null}
        </Grid>
      </Grid>
    </ListItem>
  );
};

const TimeLineAdditionalFields = ({ fields }) => {
  const styles = useStyles();

  return (
    <>
      <Grid className={styles.additionalFields} container>
        {Object.keys(fields).map(keyvalue => {
          return (
            <Grid key={fields[keyvalue]} item xs={6}>
              <Typography
                variant="h4"
                component="span"
              >{`${keyvalue}: `}</Typography>
              <Typography component="span">
                {formatAdditionalField(keyvalue, fields[keyvalue])}
              </Typography>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};

const TimeLineList = ({ selectedFeature }) => {
  const styles = useStyles();

  const [openSections, setOpenSections] = useState([]);

  const handleClick = title => {
    // Is section already open, if it exists, then it is.
    const isOpen = openSections.includes(title);
    const newSections = isOpen
      ? openSections.filter(section => section !== title)
      : [...openSections, title];
    setOpenSections(newSections);
  };

  return (
    <ChartWrapper className={styles.chartWrapper}>
      <>
        <Typography component="span" className={styles.referenceNumber}>
          Planning Application Reference Number:{' '}
        </Typography>
        <Typography component="span" color="inherit">
          {selectedFeature['Application ID']}
        </Typography>
        <List component="nav" aria-labelledby="nested-list-subheader">
          {selectedFeature.data?.length > 0 ? (
            selectedFeature.data.map(timelineItem => {
              const title = `${timelineItem.Type} - ${timelineItem.Description}`;

              return (
                <div
                  key={`${title}-${timelineItem.Source}`}
                  className={styles.timeline}
                >
                  <TimeLineListItem
                    onClick={() => handleClick(title)}
                    openSections={openSections}
                    title={title}
                    listItem={timelineItem}
                  />

                  {timelineItem.additional_fields ? (
                    <Collapse
                      in={openSections.includes(title)}
                      timeout="auto"
                      unmountOnExit
                    >
                      <TimeLineAdditionalFields
                        fields={timelineItem.additional_fields}
                      />
                    </Collapse>
                  ) : null}
                </div>
              );
            })
          ) : (
            <h3>{NO_TIMELINE_DATA}</h3>
          )}
        </List>
      </>
    </ChartWrapper>
  );
};

export const TimeLineListSkeleton = () => {
  const styles = skeletonStyles();

  return (
    <div className={styles.areas}>
      <Skeleton className={styles.bar} />
      <Skeleton className={styles.bar} />
      <Skeleton className={styles.bar} />
      <Skeleton className={styles.bar} />
      <Skeleton className={styles.bar} />
    </div>
  );
};

export default TimeLineList;
