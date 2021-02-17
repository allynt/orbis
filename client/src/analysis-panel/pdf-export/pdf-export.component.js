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
    backgroundColor: '#f4f4f4',
  },
  button: {
    position: 'absolute',
    top: '1rem',
    left: '31rem',
    zIndex: 10,
    width: 'fit-content',
    padding: '1rem',
    fontSize: '1rem',
  },
  pdf: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: '#fff',
    backgroundColor: '#333f48',
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
    padding: '1rem',
  },
  detailsGrid: {
    display: 'flex',
    height: '100%',
    width: '100%',
  },
  gridColumn: {
    display: 'flex',
    flexDirection: 'column',
    width: '33.33%',
  },
  gridElement: {
    display: 'flex',
    flexDirection: 'column',
    height: 'fit-content',
    width: '98%',
    border: ' 3px dashed #4e78a0',
    borderRadius: '0.25px',
    padding: '0.5rem',
    marginBottom: '2%',
  },
  centered: {
    alignItems: 'center',
  },
  aggregationData: {
    alignSelf: 'flex-start',
    width: '50%',
  },
  aggregateValue: {
    display: 'flex',
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
    alignItems: 'center',
    gap: '0.5rem',
    width: '100%',
    padding: '0 1rem',
    fontStyle: 'italic',
  },
  logo: {
    height: '5rem !important',
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
          style={{
            backgroundImage: `url(${image})`,
          }}
          className={materialStyles.screenshot}
        />
        <Box className={materialStyles.pdfForm}>
          <Box className={materialStyles.detailsGrid}>
            <Box className={materialStyles.gridColumn}>
              <Box className={materialStyles.gridElement}>
                <Typography variant="h3">
                  Selected Areas of interest:
                </Typography>
                <List>
                  {areasOfInterest?.map(
                    ({ within_LAD_name, identifier }, i) => (
                      <ListItem>
                        {i + 1}. {within_LAD_name || identifier}
                      </ListItem>
                    ),
                  )}
                </List>
              </Box>
              <Box className={materialStyles.gridElement}>
                <Typography variant="h4">
                  Total population: {populationTotal}
                </Typography>
                <Typography variant="h4">
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
                <Typography variant="h3">Selected Data Layer:</Typography>
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
                <Typography variant="h3">
                  {aggregation?.aggregationLabel} of selected areas:
                </Typography>
                <Typography variant="h1">{aggregation?.areaValue}</Typography>
                <Typography variant="h3">
                  {aggregation?.aggregationLabel} of all areas:
                </Typography>
                <List className={materialStyles.aggregationData}>
                  {Object.entries(selectedProperty?.aggregates)?.map(
                    ([key, value]) => (
                      <ListItem className={materialStyles.aggregateValue}>
                        <Typography variant="h3">{key}:</Typography>
                        <Typography variant="h3">{value}</Typography>
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
              {user?.name && <span>Report run by: {user.name}</span>}
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
