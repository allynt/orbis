import React, { useState } from 'react';

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

  const [image, setImage] = useState(undefined);

  const calcTotal = input =>
    clickedFeatures?.reduce(
      (acc, cur) => acc + cur.object.properties[input],
      0,
    );

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

      doc.addImage(canvas, 'PNG', 0, 0, width, height);

      doc.save('orbis-data-analysis.pdf');
    });
  };

  const getImage = screenshot => {
    const reader = new FileReader();
    reader.onload = event => {
      const result = event.target.result;
      setImage(result);
    };
    reader.readAsDataURL(screenshot);
  };

  if (screenshot) getImage(screenshot);

  // prohibits direct linking to '.pdf-export'
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
          <div className={styles.detailsGrid}>
            <div className={styles.gridColumn}>
              <div className={styles.gridElement}>
                <h3>Selected Areas of interest:</h3>
                <ul>
                  {clickedFeatures?.map(feat => (
                    <li>{feat.object.properties.within_LAD_name}</li>
                  ))}
                </ul>
              </div>
              <div className={styles.gridElement}>
                <h4>Total population: {calcTotal('population')}</h4>
                <h4>Total households: {calcTotal('households')}</h4>
              </div>
            </div>
            <div className={styles.gridColumn}>
              <div className={styles.gridElement}>
                <h3>Selected Data Layer:</h3>
                <span>{clickedFeatures?.[0].layer.id}</span>
              </div>
              <div className={styles.gridElement}>
                <h3>Value/Average of selected areas:</h3>
                <p>GB: asdfa</p>
                <p>Wales: asdfa</p>
                <p>England: asdfa</p>
                <p>Scotland: asfdg</p>
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
              <div className={styles.gridElement}>
                <h3>More Information:</h3>
                <p>
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit. Fuga
                  quidem est dolore voluptatibus, impedit praesentium placeat,
                  beatae tempore eveniet ad perspiciatis? Ex dolor veniam
                  laudantium facilis perspiciatis sint accusamus delectus.
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                  Animi dolores odit excepturi omnis maiores, assumenda minus
                  vero ipsam voluptas perferendis obcaecati sequi ab quae atque
                  sint quo iusto qui consequatur?
                </p>
              </div>
            </div>
          </div>
          <footer className={styles.footer}>
            <div className={styles.watermark}>
              <span>Data Analysis Report</span>
              <span>ORBIS by ASTROSAT</span>
            </div>
            <h2>ORBIS LOGO</h2>
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
