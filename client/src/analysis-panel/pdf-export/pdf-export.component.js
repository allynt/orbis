import React, { useState, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { push } from 'connected-react-router';

import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

import { format } from 'date-fns';

import clsx from 'clsx';

import {
  Button,
  Box,
  List,
  Grid,
  ListItemText,
  makeStyles,
  Typography,
} from '@astrosat/astrosat-ui';

import {
  propertySelector,
  clickedFeaturesDataSelector,
} from 'map/orbs/slices/isolation-plus.slice';

import OrbisLogo from './orbis-logo.png';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100%',
    backgroundColor: theme.palette.grey[100],
  },
  button: {
    position: 'absolute',
    top: theme.typography.pxToRem(8),
    left: theme.typography.pxToRem(624),
    zIndex: 10,
    padding: theme.spacing(2),
  },
  pdf: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.background.default,
    height: '100%',
    // A4 paper width/height ratio
    width: '70.5vh',
  },
  screenshot: {
    backgroundSize: 'cover',
    height: '100%',
    width: '100%',
  },
  pdfForm: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '100%',
    padding: theme.spacing(1),
  },
  detailsGrid: {
    display: 'flex',
    height: '100%',
    width: '100%',
    gap: theme.spacing(0.5),
  },
  gridColumn: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  list: {
    padding: '0',
  },
  gridElement: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(0.5),
    width: '100%',
    border: ' 2px dashed #4e78a0',
    borderRadius: theme.typography.pxToRem(5),
    '&:first-child': {
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
  },
  moreInfo: {
    textAlign: 'justify',
  },
  footerElement: {
    display: 'flex',
    gap: theme.spacing(1),
    width: '100%',
    fontStyle: 'italic',
    '&:first-child': {
      alignItems: 'flex-end',
      padding: theme.spacing(0, 2, 0, 0),
    },
    '&:last-child': {
      padding: theme.spacing(0, 0, 0, 2),
    },
  },
  logo: {
    height: `${theme.typography.pxToRem(80)} !important`,
  },
}));

const PDF = ({ user }) => {
  const dispatch = useDispatch();
  const styles = useStyles();

  const selectedProperty = useSelector(state => propertySelector(state?.orbs));

  const {
    screenshot,
    areasOfInterest,
    populationTotal,
    householdTotal,
    aggregation,
    breakdownAggregation,
    moreInformation,
  } = useSelector(state => clickedFeaturesDataSelector(state?.orbs));

  const [image, setImage] = useState(undefined);

  useEffect(() => {
    const reader = new FileReader();
    reader.onload = event => setImage(event.target.result);
    if (screenshot) {
      reader.readAsDataURL(screenshot);
    }
  }, [screenshot]);

  const creationDate = format(new Date(), 'MMMM do Y');

  const handleClick = () => {
    const div = document.getElementById('pdf-form');

    html2canvas(div).then(canvas => {
      const doc = new jsPDF();

      const width = doc.internal.pageSize.getWidth(),
        height = doc.internal.pageSize.getHeight();

      doc.addImage({
        imageData: canvas,
        format: 'JPEG',
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
    <div className={styles.container}>
      <Button className={styles.button} onClick={handleClick}>
        Download PDF Report
      </Button>
      <Box className={styles.pdf} id="pdf-form">
        <div
          className={styles.screenshot}
          style={{
            backgroundImage: `url(${image})`,
          }}
          data-testid="screenshot"
        />
        <Box className={styles.pdfForm}>
          <Grid direction="row" className={styles.detailsGrid}>
            <Grid item container className={styles.gridColumn}>
              <Grid item className={styles.gridElement}>
                <Typography>Selected Areas of interest:</Typography>
                <List className={styles.list}>
                  {areasOfInterest?.map(area_name => (
                    <ListItemText key={area_name} primary={area_name} />
                  ))}
                </List>
              </Grid>
              <Grid item className={styles.gridElement}>
                <Typography>Total population: {populationTotal}</Typography>
                <Typography>Total households: {householdTotal}</Typography>
              </Grid>
            </Grid>
            <Grid item className={styles.gridColumn}>
              <Grid item className={clsx(styles.gridElement, styles.centered)}>
                <Typography>Selected Data Layer:</Typography>
                <Typography>
                  {selectedProperty?.application?.orbis?.label ||
                    selectedProperty?.label}
                </Typography>
              </Grid>
              <Grid item className={clsx(styles.gridElement, styles.centered)}>
                <Typography>
                  {aggregation?.aggregationLabel} of selected areas:
                </Typography>
                <span className={styles.bigValue}>
                  {aggregation?.areaValue}
                </span>
                <Typography>
                  {aggregation?.aggregationLabel} of all areas:
                </Typography>
                <List className={clsx(styles.aggregationData, styles.list)}>
                  {Object.entries(selectedProperty?.aggregates)?.map(
                    ([key, value]) => (
                      <ListItemText
                        key={key}
                        className={styles.listData}
                        primary={<span>{key}: </span>}
                        secondary={<span>{value}</span>}
                      />
                    ),
                  )}
                </List>
              </Grid>
              <Grid item className={clsx(styles.gridElement, styles.centered)}>
                <Typography>
                  Breakdown of the data summed over all the selected areas:
                </Typography>
                <List className={clsx(styles.aggregationData, styles.list)}>
                  {breakdownAggregation?.map(({ name, value }) => (
                    <ListItemText
                      key={name}
                      className={styles.listData}
                      primary={<span>{name}: </span>}
                      secondary={<span>{value}</span>}
                    />
                  ))}
                </List>
              </Grid>
            </Grid>
            <Grid item className={styles.gridColumn}>
              <Grid item className={styles.gridElement}>
                <Typography>
                  The information relates to the areas selected on the map.
                </Typography>
              </Grid>
              <Grid item className={clsx(styles.gridElement, styles.moreInfo)}>
                <Typography>More Information:</Typography>
                <Typography>Source: {moreInformation?.source}</Typography>
                <Typography component="p">
                  {moreInformation?.details}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid
            container
            wrap="nowrap"
            justify="space-between"
            alignItems="center"
            component="footer"
          >
            <Grid item direction="column" className={styles.footerElement}>
              <span>Data Analysis Report</span>
              <span>ORBIS by ASTROSAT</span>
            </Grid>
            <img className={styles.logo} src={OrbisLogo} alt="Orbis logo" />
            <Grid item direction="column" className={styles.footerElement}>
              {user?.name && (
                <Typography component="p" data-testid="user-name">
                  Report run by: {user.name}
                </Typography>
              )}
              <Typography component="p">User Name: {user?.email}</Typography>
              <Typography component="p">
                Date of the Report: {creationDate}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </div>
  );
};

export default PDF;
