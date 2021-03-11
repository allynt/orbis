import React, { useState, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { push } from 'connected-react-router';

import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

import { format } from 'date-fns';

import clsx from 'clsx';

import {
  Button,
  List,
  Grid,
  ListItemText,
  makeStyles,
  Typography,
} from '@astrosat/astrosat-ui';

import {
  propertySelector,
  screenshotSelector,
  areasOfInterestSelector,
  populationTotalSelector,
  householdTotalSelector,
  aggregationSelector,
  breakdownAggregationSelector,
} from 'map/orbs/slices/isolation-plus.slice';

import OrbisLogo from './orbis-logo.png';

const useStyles = makeStyles(theme => ({
  container: {
    height: '100%',
    backgroundColor: theme.palette.grey[100],
  },
  button: {
    position: 'absolute',
    top: theme.typography.pxToRem(8),
    left: theme.typography.pxToRem(624),
    zIndex: 10,
    padding: theme.spacing(1),
  },
  pdf: {
    position: 'relative',
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.background.default,
    height: '100%',
    // A4 paper width/height ratio
    width: '70.5vh',
  },
  screenshot: {
    backgroundSize: 'cover',
    height: '33.3%',
    width: '100%',
  },
  pdfDocument: {
    height: '66.6%',
    width: '100%',
    padding: theme.spacing(1),
    wordBreak: 'break-word',
  },
  detailsGrid: {
    width: '100%',
    gap: theme.spacing(1),
  },
  gridColumn: {
    maxWidth: '33.3%',
  },
  list: {
    padding: '0',
  },
  gridElement: {
    padding: theme.spacing(1),
    width: '100%',
    border: ' 2px dashed #4e78a0',
    borderRadius: theme.typography.pxToRem(5),
    '&:not(:last-child)': {
      marginBottom: theme.spacing(1),
    },
    '& > *:not(:last-child)': {
      marginBottom: theme.spacing(1),
    },
  },
  centered: {
    textAlign: 'center',
    alignItems: 'center',
  },
  aggregationData: {
    alignSelf: 'flex-start',
    minWidth: '75%',
  },
  bigValue: {
    fontSize: theme.typography.pxToRem(32),
    fontWeight: 'bold',
  },
  listData: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: theme.spacing(1, 0),
  },
  footerElement: {
    width: '100%',
    fontStyle: 'italic',
    '&:first-child': {
      padding: theme.spacing(0, 2, 0, 0),
    },
    '&:last-child': {
      padding: theme.spacing(0, 0, 0, 2),
    },
  },
  logo: {
    height: theme.typography.pxToRem(40),
  },
}));

const date = format(new Date(), 'MMMM do Y');

const PDF = ({ user, creationDate = date }) => {
  const styles = useStyles();
  const dispatch = useDispatch();

  const selectedProperty = useSelector(state => propertySelector(state?.orbs));
  const screenshot = useSelector(state => screenshotSelector(state?.orbs));

  const areasOfInterest = useSelector(state =>
    areasOfInterestSelector(state?.orbs),
  );

  const populationTotal = useSelector(state =>
    populationTotalSelector(state?.orbs),
  );

  const householdTotal = useSelector(state =>
    householdTotalSelector(state?.orbs),
  );

  const areaValue = useSelector(state => aggregationSelector(state?.orbs));

  const breakdownAggregation = useSelector(state =>
    breakdownAggregationSelector(state?.orbs),
  );

  const [image, setImage] = useState(undefined);

  const aggregationLabel =
    selectedProperty?.aggregation === 'sum' ? 'Sum' : 'Average';

  useEffect(() => {
    const reader = new FileReader();
    reader.onload = event => setImage(event.target.result);
    if (screenshot) {
      reader.readAsDataURL(screenshot);
    }
  }, [screenshot]);

  const handleClick = () => {
    const div = document.getElementById('pdf-form');

    html2canvas(div).then(canvas => {
      const doc = new jsPDF();

      const width = doc.internal.pageSize.getWidth(),
        height = doc.internal.pageSize.getHeight();

      doc.addImage({
        imageData: canvas,
        x: 0,
        y: 0,
        width,
        height,
        compression: 'NONE',
      });

      doc.save('orbis-data-analysis.pdf');
    });
  };

  if (!selectedProperty?.source_id) {
    dispatch(push('/'));
    return null;
  }
  return (
    <Grid
      container
      justify="center"
      alignItems="center"
      className={styles.container}
    >
      <Button className={styles.button} onClick={handleClick}>
        Download PDF Report
      </Button>
      <Grid
        item
        container
        direction="column"
        className={styles.pdf}
        id="pdf-form"
      >
        <div
          className={styles.screenshot}
          style={{
            backgroundImage: `url(${image})`,
          }}
          data-testid="screenshot"
        />
        <Grid
          item
          container
          direction="column"
          wrap="nowrap"
          justify="space-between"
          className={styles.pdfDocument}
        >
          <Grid item container wrap="nowrap" className={styles.detailsGrid}>
            <Grid
              item
              container
              direction="column"
              className={styles.gridColumn}
            >
              {areasOfInterest && (
                <Grid item className={styles.gridElement}>
                  <Typography variant="h3">
                    Selected Areas of interest:
                  </Typography>
                  <List className={styles.list}>
                    {areasOfInterest?.map(area_name => (
                      <ListItemText key={area_name} primary={area_name} />
                    ))}
                  </List>
                </Grid>
              )}
              {(populationTotal || householdTotal) && (
                <Grid item className={styles.gridElement}>
                  <List className={clsx(styles.aggregationData, styles.list)}>
                    <ListItemText
                      className={styles.listData}
                      primary={
                        <Typography variant="h4">Total population: </Typography>
                      }
                      secondary={<span>{populationTotal}</span>}
                    />
                    <ListItemText
                      className={styles.listData}
                      primary={
                        <Typography variant="h4">Total households: </Typography>
                      }
                      secondary={<span>{householdTotal}</span>}
                    />
                  </List>
                </Grid>
              )}
            </Grid>
            <Grid
              item
              container
              direction="column"
              className={styles.gridColumn}
            >
              <Grid item className={clsx(styles.gridElement, styles.centered)}>
                <Typography variant="h3">Selected Data Layer:</Typography>
                <Typography>
                  {selectedProperty?.application?.orbis?.label ||
                    selectedProperty?.label}
                </Typography>
              </Grid>
              {areaValue !== undefined && selectedProperty?.aggregates ? (
                <Grid
                  item
                  className={clsx(styles.gridElement, styles.centered)}
                >
                  <Typography variant="h3">
                    {areasOfInterest?.length > 1
                      ? `${aggregationLabel} of
                      selected areas:`
                      : 'Value of selected area:'}
                  </Typography>
                  <div className={styles.bigValue}>{areaValue}</div>
                  <Typography variant="h3">
                    {aggregationLabel} of all areas:
                  </Typography>
                  <List className={clsx(styles.aggregationData, styles.list)}>
                    {selectedProperty?.aggregates &&
                      Object.entries(selectedProperty?.aggregates)?.map(
                        ([key, value]) => (
                          <ListItemText
                            key={key}
                            className={styles.listData}
                            primary={
                              <Typography variant="h4" align="left">
                                {key}:{' '}
                              </Typography>
                            }
                            secondary={<span>{value}</span>}
                          />
                        ),
                      )}
                  </List>
                </Grid>
              ) : null}
              {breakdownAggregation?.length ? (
                <Grid
                  item
                  className={clsx(styles.gridElement, styles.centered)}
                >
                  <Typography variant="h3">
                    Breakdown of the data summed over all the selected areas:
                  </Typography>
                  <List className={clsx(styles.aggregationData, styles.list)}>
                    {breakdownAggregation?.map(({ name, value }) => (
                      <ListItemText
                        key={name}
                        className={styles.listData}
                        primary={
                          <Typography variant="h4" align="left">
                            {name}:{' '}
                          </Typography>
                        }
                        secondary={<span>{value}</span>}
                      />
                    ))}
                  </List>
                </Grid>
              ) : null}
            </Grid>
            <Grid
              item
              container
              direction="column"
              className={styles.gridColumn}
            >
              <Grid item className={styles.gridElement}>
                <Typography>
                  The information relates to the areas selected on the map.
                </Typography>
              </Grid>
              <Grid item className={styles.gridElement}>
                <Typography variant="h3">More Information:</Typography>
                <Typography>Source: {selectedProperty?.source}</Typography>
                <Typography component="p" align="justify">
                  {selectedProperty?.details}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid
            item
            container
            component="footer"
            wrap="nowrap"
            justify="space-between"
            alignItems="center"
          >
            <Grid
              item
              container
              direction="column"
              alignItems="flex-end"
              className={styles.footerElement}
            >
              <Typography>Data Analysis Report</Typography>
              <Typography>ORBIS by ASTROSAT</Typography>
            </Grid>
            <img className={styles.logo} src={OrbisLogo} alt="Orbis logo" />
            <Grid
              item
              container
              direction="column"
              className={styles.footerElement}
            >
              {user?.name && (
                <Typography data-testid="user-name">
                  Report run by: {user.name}
                </Typography>
              )}
              <Typography>User Name: {user?.email}</Typography>
              <Typography>Date of the Report: {creationDate}</Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default PDF;
