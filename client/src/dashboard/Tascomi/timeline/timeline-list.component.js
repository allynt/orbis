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
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#4e5d65',
    borderRadius: '0.3rem',
    '&:hover': {
      backgroundColor: '#4e5d65',
    },
    '&$open': {
      borderRadius: '0.3rem',
      border: '1px solid #cfa228',
    },
  },
  chevrons: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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
  collapsable: {
    width: '100%',
  },
  additionalFields: {
    padding: `${theme.spacing(2)} 0 ${theme.spacing(2)} 0`,
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

const TimeLineListItem = ({
  onClick,
  openSections,
  title,
  timelineId,
  listItem,
  hasAdditionalFields,
  children,
}) => {
  const styles = useStyles();

  const date = listItem.Date ? formatDate(new Date(listItem.Date)) : NO_DATE;

  return (
    <ListItem
      button
      onClick={onClick}
      className={clsx(styles.listItem, {
        [styles.open]: hasAdditionalFields && openSections.includes(timelineId),
      })}
      role="listitem"
    >
      <Grid container>
        <Grid item xs={1} className={styles.chevrons}>
          {hasAdditionalFields ? (
            openSections.includes(timelineId) ? (
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

        <Grid container item xs={11}>
          <Grid item xs={12}>
            <Typography variant="h4">{title}</Typography>
          </Grid>

          <Grid className={styles.strapline} item xs={5}>
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
        </Grid>
      </Grid>

      {children}
    </ListItem>
  );
};

const TimeLineAdditionalFields = ({ fields }) => {
  const styles = useStyles();

  return (
    <Grid container>
      <Grid item xs={1}>
        {' '}
      </Grid>

      <Grid container item xs={11} className={styles.additionalFields}>
        {Object.keys(fields).map(keyvalue => {
          return (
            <Grid key={fields[keyvalue]} item xs={5}>
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
    </Grid>
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
              const timelineId = `${title}-${timelineItem.Date}`;

              // If there are additional fields, then we need to add a section
              const hasAdditionalFields =
                timelineItem.additional_fields &&
                Object.keys(timelineItem.additional_fields).length > 0;

              return (
                <div key={timelineId} className={styles.timeline}>
                  <TimeLineListItem
                    onClick={() => handleClick(timelineId)}
                    openSections={openSections}
                    title={title}
                    timelineId={timelineId}
                    listItem={timelineItem}
                    hasAdditionalFields={hasAdditionalFields}
                  >
                    {hasAdditionalFields ? (
                      <Collapse
                        className={styles.collapsable}
                        in={openSections.includes(timelineId)}
                        timeout="auto"
                        unmountOnExit
                      >
                        <TimeLineAdditionalFields
                          fields={timelineItem.additional_fields}
                        />
                      </Collapse>
                    ) : null}
                  </TimeLineListItem>
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
