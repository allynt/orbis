import React, { useState } from 'react';

import { Redirect } from 'react-router-dom';

import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

import { format } from 'date-fns';

import clsx from 'clsx';

import {
  Button,
  Box,
  List,
  ListItem,
  makeStyles,
  Typography,
} from '@astrosat/astrosat-ui';

import { useSelector } from 'react-redux';

import {
  propertySelector,
  pdfDataSelector,
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
    top: theme.typography.pxToRem(16),
    left: theme.typography.pxToRem(496),
    zIndex: 10,
    width: 'fit-content',
    padding: theme.typography.pxToRem(16),
    fontSize: theme.typography.pxToRem(16),
  },
  pdf: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: theme.palette.common.white,
    backgroundColor: theme.palette.background.default,
    height: '100%',
    width: '50%',
  },
  screenshot: {
    backgroundSize: 'cover',
    height: '50%',
    width: '100%',
  },
  pdfForm: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '100%',
    height: '50%',
    padding: theme.typography.pxToRem(16),
  },
  detailsGrid: {
    display: 'flex',
    gap: theme.spacing(1),
    height: '100%',
    width: '100%',
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
    gap: theme.spacing(1),
    padding: theme.typography.pxToRem(8),
    width: '100%',
    border: ' 3px dashed #4e78a0',
    borderRadius: theme.typography.pxToRem(5),
    '&:first-child': {
      marginBottom: theme.spacing(1),
    },
  },
  centered: {
    alignItems: 'center',
  },
  aggregationData: {
    alignSelf: 'flex-start',
    width: '50%',
  },
  bigValue: {
    fontSize: theme.typography.pxToRem(48),
    fontWeight: 'bold',
  },
  regionValues: {
    justifyContent: 'space-between',
  },
  moreInfo: {
    textAlign: 'justify',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerElement: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    width: '100%',
    padding: theme.spacing(0, 4),
    fontStyle: 'italic',
    '&:first-child': {
      alignItems: 'flex-end',
    },
  },
  logo: {
    height: `${theme.typography.pxToRem(80)} !important`,
  },
}));

const PDF = ({ user }) => {
  const materialStyles = useStyles();

  const selectedProperty = useSelector(state => propertySelector(state?.orbs));

  const {
    screenshot,
    areasOfInterest,
    populationTotal,
    householdTotal,
    aggregation,
    moreInformation,
  } = useSelector(state => pdfDataSelector(state?.orbs));

  const creationDate = format(new Date(), ['MMMM do Y']);

  const [image, setImage] = useState(undefined);

  const handleClick = () => {
    const div = document.getElementById('pdf-form');

    html2canvas(div).then(canvas => {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'pc',
        format: [100, 100],
      });

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

  // process screenshot immediately
  (screenshot => {
    const reader = new FileReader();
    reader.onload = event => {
      const result = event.target.result;
      setImage(result);
    };
    if (screenshot) reader.readAsDataURL(screenshot);
  })(screenshot);

  // prohibits direct linking to '/pdf-export'
  if (!selectedProperty?.source_id) return <Redirect to="/" />;
  return (
    <Box className={materialStyles.container}>
      <Button className={materialStyles.button} onClick={handleClick}>
        Download PDF Report
      </Button>
      <Box className={materialStyles.pdf} id="pdf-form">
        {/* the below styling is inline because jsPDF does not recognise 'object-fit', yet the image displaying as 'cover' is required */}
        <div
          className={materialStyles.screenshot}
          style={{
            backgroundImage: `url(${image})`,
          }}
          data-testid="screenshot"
        />
        <Box className={materialStyles.pdfForm}>
          <Box className={materialStyles.detailsGrid}>
            <Box className={materialStyles.gridColumn}>
              <Box className={materialStyles.gridElement}>
                <Typography variant="h2">
                  Selected Areas of interest:
                </Typography>
                <List className={materialStyles.list}>
                  {areasOfInterest?.map(({ within_LAD_name, identifier }) => (
                    <ListItem>
                      <Typography variant="h4">
                        {within_LAD_name || identifier}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              </Box>
              <Box className={materialStyles.gridElement}>
                <Typography variant="h3">
                  Total population: {populationTotal}
                </Typography>
                <Typography variant="h3">
                  Total households: {householdTotal}
                </Typography>
              </Box>
            </Box>
            <Box className={materialStyles.gridColumn}>
              <Box
                className={clsx(
                  materialStyles.gridElement,
                  materialStyles.centered,
                )}
              >
                <Typography variant="h2">Selected Data Layer:</Typography>
                <Box component="span">
                  {selectedProperty?.application?.orbis?.label ||
                    selectedProperty?.label}
                </Box>
              </Box>
              <Box
                className={clsx(
                  materialStyles.gridElement,
                  materialStyles.centered,
                )}
              >
                <Typography variant="h2">
                  {aggregation?.aggregationLabel} of selected areas:
                </Typography>
                <Box component="span" className={materialStyles.bigValue}>
                  {aggregation?.areaValue}
                </Box>
                <Typography variant="h3">
                  {aggregation?.aggregationLabel} of all areas:
                </Typography>
                <List
                  className={clsx(
                    materialStyles.aggregationData,
                    materialStyles.list,
                  )}
                >
                  {Object.entries(selectedProperty?.aggregates)?.map(
                    ([key, value]) => (
                      <ListItem className={materialStyles.regionValues}>
                        <Typography variant="h4">{key}:</Typography>
                        <Typography variant="h4">{value}</Typography>
                      </ListItem>
                    ),
                  )}
                </List>
              </Box>
            </Box>
            <Box className={materialStyles.gridColumn}>
              <Box className={materialStyles.gridElement}>
                The information relates to the areas selected on the map.
              </Box>
              <Box
                className={clsx(
                  materialStyles.gridElement,
                  materialStyles.moreInfo,
                )}
              >
                <Typography variant="h3">More Information:</Typography>
                <Typography component="p">{moreInformation}</Typography>
              </Box>
            </Box>
          </Box>
          <footer className={materialStyles.footer}>
            <Box className={materialStyles.footerElement}>
              <Box component="span">Data Analysis Report</Box>
              <Box component="span">ORBIS by ASTROSAT</Box>
            </Box>
            {/* jsPDF cannot render SVG components, hence the PNG image */}
            <img
              className={materialStyles.logo}
              src={OrbisLogo}
              alt="Orbis logo"
            />
            <Box className={materialStyles.footerElement}>
              {user?.name && (
                <span data-testid="user-name">Report run by: {user.name}</span>
              )}
              <Box component="span">User Name: {user?.email}</Box>
              <Box component="span">Date of the Report: {creationDate}</Box>
            </Box>
          </footer>
        </Box>
      </Box>
    </Box>
  );
};

export default PDF;
