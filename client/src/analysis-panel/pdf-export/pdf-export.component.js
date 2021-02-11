import React from 'react';

import { Redirect } from 'react-router-dom';

import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

import { format } from 'date-fns';

import { useSelector } from 'react-redux';

import {
  clickedFeaturesSelector,
  propertySelector,
  screenshotSelector,
} from 'map/orbs/slices/isolation-plus.slice';

import { OrbisLogo } from 'components';

import styles from './pdf-export.module.css';

const PDF = ({ user }) => {
  const clickedFeatures = useSelector(state =>
    clickedFeaturesSelector(state?.orbs),
  );
  const selectedProperty = useSelector(state => propertySelector(state?.orbs));
  const screenshot = useSelector(state => screenshotSelector(state?.orbs));

  const creationDate = format(new Date(), ['MMMM do Y']);

  const data = clickedFeatures?.[0]?.object?.properties;

  const handleClick = async () => {
    const div = document.getElementById('pdf-form');

    const canvas = await html2canvas(div);
    const url = canvas.toDataURL('image/png', 0.1);

    const doc = new jsPDF();

    doc.addImage(url, 'JPEG', 0, 0);
    doc.save('orbis-data-analysis.pdf');
  };

  let image;
  if (screenshot) {
    image = URL.createObjectURL(screenshot);
  }

  if (!selectedProperty?.source_id) return <Redirect to="/" />;
  return (
    <div className={styles.container}>
      <button className={styles.button} onClick={handleClick}>
        Download PDF
      </button>
      <div className={styles.pdf} id="pdf-form">
        <img
          className={styles.screenshot}
          src={image}
          alt="Screenshot of map"
        />
        <div className={styles.pdfForm}>
          <p>The information relates to the areas selected on the map</p>
          <ul className={styles.list}>
            {Object.entries(data).map(([key, value]) => {
              return (
                <li className={styles.listItem}>
                  <span className={styles.key}>{key}: </span>
                  <span>{value}</span>
                </li>
              );
            })}
          </ul>
          <footer className={styles.footer}>
            <div className={styles.watermark}>
              <span>Data Analysis Report</span>
              <span>ORBIS by ASTROSAT</span>
            </div>
            <OrbisLogo className={styles.logo} />
            <div className={styles.userDetails}>
              {user?.name && <span>Report run by: {user.name}</span>}
              <span>user name: {user?.email}</span>
              <span>Date of the report: {creationDate}</span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default PDF;
