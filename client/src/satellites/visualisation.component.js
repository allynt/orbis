import React from 'react';
import PropTypes from 'prop-types';

import { useDispatch } from 'react-redux';

import Button from '@astrosat/astrosat-ui/dist/buttons/button';

import { SEARCH } from './satellites-panel.component';

import { removeScenes } from './satellites.slice';

import styles from './visualisation.module.css';
import sideMenuStyles from '../side-menu/side-menu.module.css';

const Visualisation = ({ visualisations, setVisiblePanel }) => {
  const dispatch = useDispatch();
  return (
    visualisations && (
      <div className={styles.content}>
        <ul className={styles.visualisations}>
          <h3>VISUALISATION</h3>
          {visualisations.map(visualisation => {
            return (
              <li
                key={visualisation.label}
                className={`${styles.visualisation} ${visualisation.id !== 'true-color' ? styles.disabled : ''}`}
                onClick={() => console.log('Clicked Visualisation: ', visualisation)}
              >
                <img className={styles.thumbnail} src={visualisation.thumbnail} alt="Thumbnail" />

                <ul className={styles.metadata}>
                  <li className={styles.metaHeader}>{visualisation.label}</li>
                  <li>{visualisation.description}</li>
                </ul>
              </li>
            );
          })}
        </ul>

        <div className={sideMenuStyles.buttons}>
          <Button
            theme="primary"
            classNames={[sideMenuStyles.button]}
            onClick={() => {
              setVisiblePanel(SEARCH);
              dispatch(removeScenes());
            }}
          >
            Return to Search
          </Button>
        </div>
      </div>
    )
  );
};

Visualisation.propTypes = {};

export default Visualisation;
