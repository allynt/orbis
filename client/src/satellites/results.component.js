import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { useDispatch } from 'react-redux';

import parseISO from 'date-fns/parseISO';
import format from 'date-fns/format';

import Slider from '@astrosat/astrosat-ui/dist/forms/slider';

import { VISUALISATION } from './satellites-panel.component';

import styles from './results.module.css';

const Results = ({ scenes, setVisiblePanel, selectScene }) => {
  const dispatch = useDispatch();
  const [cloudCoverPercentage, setCloudCoverPercentage] = useState([10]);

  return (
    scenes && (
      <div>
        <div className={styles.options}>
          <h3>CLOUD COVER %:</h3>

          <Slider min={0} max={100} values={cloudCoverPercentage} onChange={value => setCloudCoverPercentage(value)} />
        </div>

        <div className={styles.results}>
          <h3>RESULTS</h3>

          <div className={styles.resultCount}>
            Showing {scenes.filter(scene => scene.properties.cloudCoverAsPercentage <= cloudCoverPercentage[0]).length}{' '}
            Results
          </div>

          <ul className={styles.scenes}>
            {scenes
              .filter(scene => scene.properties.cloudCoverAsPercentage <= cloudCoverPercentage[0])
              .map(scene => {
                return (
                  <li
                    key={scene.id}
                    className={styles.scene}
                    onClick={() => {
                      dispatch(selectScene(scene));
                      setVisiblePanel(VISUALISATION);
                    }}
                  >
                    <img className={styles.thumbnail} src={scene.thumbnail} alt="Thumbnail" />
                    <ul className={styles.metadata}>
                      <li>{format(parseISO(scene.properties.created), 'dd-MM-yyyy')}</li>
                      <li>{format(parseISO(scene.properties.created), 'kk:mm:ss')} UTC</li>
                      <li>{scene.properties.cloudCoverAsPercentage} %</li>
                      <li>{scene.properties.crs}</li>
                      <li>{scene.properties.label}</li>
                    </ul>
                  </li>
                );
              })}
          </ul>
        </div>
      </div>
    )
  );
};

Results.propTypes = {};

export default Results;
