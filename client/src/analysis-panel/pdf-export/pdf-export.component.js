import React, { useEffect, useState } from 'react';

import {
  Button,
  CloseIcon,
  Grid,
  IconButton,
  List,
  ListItemText,
  makeStyles,
  Typography,
} from '@astrosat/astrosat-ui';

import clsx from 'clsx';
import { format } from 'date-fns';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { useAnalysisPanelContext } from 'analysis-panel/analysis-panel-context';
import { useMap } from 'MapContext';

import { userSelector } from '../../accounts/accounts.selectors';
import OrbisLogo from './orbis-logo.png';

const useStyles = makeStyles(theme => ({
  container: {
    height: '100%',
    // A4 paper width/height ratio
    width: '71vh',
  },
  buttons: {
    position: 'absolute',
    top: '0',
    left: '0',
    padding: theme.spacing(1.5),
    width: 'inherit',
    zIndex: 10,
  },
  button: {
    padding: theme.spacing(1),
  },
  pdf: {
    alignSelf: 'center',
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.background.default,
    height: 'inherit',
    width: 'inherit',
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
  userDetails: {
    '& > *': {
      fontSize: theme.typography.pxToRem(12),
    },
  },
  logo: {
    height: theme.typography.pxToRem(40),
  },
}));

export const CHAR_MAX = 150;
const date = format(new Date(), 'MMMM do Y');

const PDF = ({
  close,
  licence,
  creationDate = date,
  selectedProperty,
  selectedTimestamp,
}) => {
  const styles = useStyles();
  const navigate = useNavigate();

  const user = useSelector(userSelector);

  const {
    areasOfInterest,
    populationTotal,
    householdTotal,
    areaValue,
    breakdownAggregation,
  } = useAnalysisPanelContext();

  const {
    createScreenshot,
    topMapRef,
    bottomMapRef,
    topDeckRef,
    bottomDeckRef,
  } = useMap();
  const [image, setImage] = useState(undefined);

  const aggregationLabel =
    selectedProperty?.aggregation === 'sum' ? 'Sum' : 'Average';

  useEffect(() => {
    if (
      !topMapRef.current ||
      !bottomMapRef.current ||
      !topDeckRef.current ||
      !bottomDeckRef.current
    ) {
      return;
    } else {
      createScreenshot(screenshot => {
        const reader = new FileReader();
        reader.onload = event => setImage(event.target.result);
        reader.readAsDataURL(screenshot);
      });
    }
  }, [createScreenshot, topMapRef, bottomMapRef, topDeckRef, bottomDeckRef]);

  const handleLongText = text => {
    return text?.length > CHAR_MAX ? `${text.slice(0, CHAR_MAX)}...` : text;
  };

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
    close();
  };

  if (!selectedProperty?.source_id) {
    navigate('/');
    return null;
  }

  return (
    <Grid container direction="column" className={styles.container}>
      <Grid
        container
        item
        justifyContent="space-between"
        alignItems="center"
        className={styles.buttons}
      >
        <Button onClick={handleClick} className={styles.button}>
          Download PDF Report
        </Button>
        <IconButton aria-label="Close" size="small" onClick={close}>
          <CloseIcon titleAccess="Close" fontSize="inherit" />
        </IconButton>
      </Grid>
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
          justifyContent="space-between"
          className={styles.pdfDocument}
        >
          <Grid item container wrap="nowrap" className={styles.detailsGrid}>
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
                {!!selectedTimestamp &&
                new Date(selectedTimestamp).getTime() !==
                  new Date(
                    selectedProperty.timeseries_latest_timestamp,
                  ).getTime() ? (
                  <Typography>
                    Historical data is being used to create this report. The
                    selected date is{' '}
                    {format(new Date(selectedTimestamp), 'dd-MM-yyyy')}
                  </Typography>
                ) : null}
              </Grid>

              <Grid item className={styles.gridElement}>
                <Typography variant="h3">More Information:</Typography>
                <Typography>
                  <strong>Source: </strong>
                  {handleLongText(selectedProperty?.source)}
                </Typography>
                <Typography>
                  <strong>Licence: </strong>
                  {handleLongText(licence)}
                </Typography>
                <Typography component="p" align="justify">
                  <strong>Details: </strong>
                  {handleLongText(selectedProperty?.details)}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid
            item
            container
            component="footer"
            wrap="nowrap"
            justifyContent="space-between"
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
              className={clsx(styles.footerElement, styles.userDetails)}
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
