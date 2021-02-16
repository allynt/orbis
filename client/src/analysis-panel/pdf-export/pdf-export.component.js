import React, { useState } from 'react';

import { Redirect } from 'react-router-dom';

import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

import { format } from 'date-fns';

import { Button } from '@astrosat/astrosat-ui';

import { useSelector } from 'react-redux';

import {
  propertySelector,
  pdfDataSelector,
} from 'map/orbs/slices/isolation-plus.slice';

import OrbisLogo from './orbis-logo.png';

import styles from './pdf-export.module.css';

const PDF = ({ user }) => {
  const selectedProperty = useSelector(state => propertySelector(state?.orbs));

  const pdfData = useSelector(state => pdfDataSelector(state?.orbs));

  const {
    screenshot,
    areasOfInterest,
    populationTotal,
    householdTotal,
    aggregation,
    moreInformation,
  } = pdfData;

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

  (screenshot => {
    const reader = new FileReader();
    reader.onload = event => {
      const result = event.target.result;
      setImage(result);
    };
    if (screenshot) reader.readAsDataURL(screenshot);
  })(screenshot);

  // prohibits direct linking to '.pdf-export'
  if (!selectedProperty?.source_id) return <Redirect to="/" />;
  return (
    <div className={styles.container}>
      <Button className={styles.button} onClick={handleClick}>
        Download as PDF
      </Button>
      <div className={styles.pdf} id="pdf-form">
        {/* the below styling is inline because jsPDF does not recognise 'object-fit', yet the image displaying as 'cover' is essential */}
        <div
          style={{
            backgroundImage: `url(${image})`,
            backgroundSize: 'cover',
            height: '40%',
            width: '100%',
          }}
        />
        <div className={styles.pdfForm}>
          <div className={styles.detailsGrid}>
            <div className={styles.gridColumn}>
              <div className={styles.gridElement}>
                <h3>Selected Areas of interest:</h3>
                <ul>
                  {areasOfInterest?.map(({ within_LAD_name, identifier }) => (
                    <li>{within_LAD_name || identifier}</li>
                  ))}
                </ul>
              </div>
              <div className={styles.gridElement}>
                <h4>Total population: {populationTotal}</h4>
                <h4>Total households: {householdTotal}</h4>
              </div>
            </div>
            <div className={styles.gridColumn}>
              <div className={`${styles.gridElement} ${styles.centered}`}>
                <h3>Selected Data Layer:</h3>
                <span>
                  {selectedProperty?.application?.orbis?.label ||
                    selectedProperty?.label}
                </span>
              </div>
              <div className={`${styles.gridElement} ${styles.centered}`}>
                <h3>{aggregation?.aggregationLabel} of selected areas:</h3>
                <h1>{aggregation?.areaValue}</h1>
              </div>
              <div className={styles.gridElement}>
                <h3>
                  Breakdown of the data summed over all of the selected areas:
                </h3>
                <p>Value 1: asdf</p>
                <p>Value 2: asdf</p>
                <p>Value 3: asdf</p>
                <p>Value 4: asdf</p>
              </div>
            </div>
            <div className={styles.gridColumn}>
              <div className={styles.gridElement}>
                The information relates to the areas selected on the map.
              </div>
              <div className={`${styles.gridElement} ${styles.moreInfo}`}>
                <h3>More Information:</h3>
                <p>{moreInformation}</p>
              </div>
            </div>
          </div>
          <footer className={styles.footer}>
            <div className={styles.watermark}>
              <span>Data Analysis Report</span>
              <span>ORBIS by ASTROSAT</span>
            </div>
            {/* jsPDF cannot render SVG components, hence the PNG image */}
            <img className={styles.logo} src={OrbisLogo} alt="Orbis logo" />
            <div className={styles.userDetails}>
              {user?.name && <span>Report run by: {user.name}</span>}
              <span>User Name: {user?.email}</span>
              <span>Date of the Report: {creationDate}</span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default PDF;
