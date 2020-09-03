import React from 'react';

import styles from './mysupplylynk-feature-detail.module.css';

const DEFAULT_TITLE = 'Feature Details';
const NOT_AVAILABLE = 'Not Available';

const MySupplyLynkFeatureDetail = ({ data }) => {
  const getCategories = items => {
    return items.length
      ? items.reduce((acc, cur) => (acc = [...acc, cur.Category]), [])
      : [NOT_AVAILABLE];
  };

  return (
    <div className={styles.featureDetail}>
      <h1 className={styles.header}>{data.Name || DEFAULT_TITLE}</h1>
      <div className={styles.content}>
        <ul className={styles.list}>
          <li className={styles.listItem}>
            <span className={styles.label}>Address Line 1: </span>
            <span className={styles.value}>
              {data['Address Line 1'] || NOT_AVAILABLE}
            </span>
          </li>
          <li className={styles.listItem}>
            <span className={styles.label}>Address Line 2: </span>
            <span className={styles.value}>
              {data['Address Line 2'] || NOT_AVAILABLE}
            </span>
          </li>
          <li className={styles.listItem}>
            <span className={styles.label}>Postcode: </span>
            <span className={styles.value}>
              {data.Postcode || NOT_AVAILABLE}
            </span>
          </li>
          <li className={styles.listItem}>
            <span className={styles.label}>Website: </span>
            <span className={styles.value}>{data.URL || NOT_AVAILABLE}</span>
          </li>
          <li className={styles.listItem}>
            <span>
              <span className={styles.label}>Supply Categories:</span>
              {getCategories(data.Items).slice().sort().join(', ')}
            </span>
          </li>
          <li className={styles.listItem}>
            <span className={styles.label}>Click for details!</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default MySupplyLynkFeatureDetail;
