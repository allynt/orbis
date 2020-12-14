import React from 'react';

import { Button } from '@astrosat/astrosat-ui';

import { SEARCH } from './satellites-panel.component';

import styles from './visualisation.module.css';
import sideMenuStyles from '../side-menu/control-panel.module.css';

const Visualisation = ({
  visualisations,
  setVisiblePanel,
  removeScenes,
  setCurrentVisualisation,
}) =>
  visualisations && (
    <div className={styles.content}>
      <ul className={styles.visualisations}>
        <h3>VISUALISATION</h3>
        {visualisations.map(visualisation => (
          <li
            key={visualisation.label}
            className={`${styles.visualisation} ${
              visualisation.id !== 'true-color' ? styles.disabled : ''
            }`}
            onClick={() => setCurrentVisualisation('TCI')} // FIXME: hard-code until we have ability to use different visualisations.
          >
            <picture>
              <img
                className={styles.thumbnail}
                src={visualisation.thumbnail}
                alt="Scene Visualisation Thumbnail"
              />
            </picture>

            <ul className={styles.metadata}>
              <li className={styles.metaHeader}>{visualisation.label}</li>
              <li>{visualisation.description}</li>
            </ul>
          </li>
        ))}
      </ul>

      <div className={sideMenuStyles.buttons}>
        <Button
          theme="primary"
          classNames={[sideMenuStyles.button]}
          onClick={() => {
            setVisiblePanel(SEARCH);
            removeScenes();
          }}
        >
          Return to Search
        </Button>
      </div>
    </div>
  );

export default Visualisation;
