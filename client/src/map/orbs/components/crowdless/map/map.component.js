import clsx from 'clsx';
import * as React from 'react';
import styles from './map.module.css';

/**
 * @param {{
 *   feature?: CrowdlessFeature
 * }} props
 */
const CrowdlessMapComponent = ({ feature }) => {
  const {
    address = undefined,
    name = undefined,
    crowdednessCategory = undefined,
    crowdednessScore = undefined,
  } = feature?.properties || {};

  return (
    <div className={styles.feature}>
      <div className={styles.categories}>
        <div
          className={clsx(styles.category, styles.notBusy, {
            [styles.image]: crowdednessCategory === 'not busy',
          })}
        />
        <div
          className={clsx(styles.category, styles.busy, {
            [styles.image]: crowdednessCategory === 'busy',
          })}
        />
        <div
          className={clsx(styles.category, styles.veryBusy, {
            [styles.image]: crowdednessCategory === 'very busy',
          })}
        />
      </div>
      <p className={styles.score}>Estimated crowdedness: {crowdednessScore}%</p>
      <h2 className={styles.name}>{name}</h2>
      <p>{address}</p>
    </div>
  );
};

export default CrowdlessMapComponent;
