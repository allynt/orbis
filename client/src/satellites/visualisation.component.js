import React from 'react';
import PropTypes from 'prop-types';

import styles from './visualisation.module.css';

const Visualisation = ({ visualisations }) => {
  return (
    visualisations && (
      <div>
        <h3>VISUALISATION</h3>

        <ul className={styles.visualisations}>
          {visualisations.map(visualisation => {
            return (
              <li
                key={visualisation.label}
                className={`${styles.visualisation} ${visualisation.id !== 'true-color' ? styles.disabled : ''}`}
                onClick={() => console.log('Clicked Visualisation: ', visualisation)}
              >
                <img className={styles.thumbnail} src={visualisation.thumbnail} alt="Thumbnail" />
                <ul className={styles.metadata}>
                  <li>{visualisation.label}</li>
                  <li>{visualisation.description}</li>
                </ul>
              </li>
            );
          })}
        </ul>
      </div>
    )
  );
};

Visualisation.propTypes = {};

export default Visualisation;
