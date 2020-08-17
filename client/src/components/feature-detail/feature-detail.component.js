import React from 'react';

import styles from './feature-detail.module.css';
import { DEFAULT_TITLE } from './feature-detail.constants';

const OBJECT = 'object';
const NULL = 'null';
const NO_DATA = 'Not available';

/**
 * @param {{
 *   jsonKey?: string
 *   value: any[]
 * }} props
 */
const ArrayItem = ({ jsonKey, value }) => (
  <li className={styles.listItem}>
    <ul className={styles.table}>
      {jsonKey && <h2 className={styles.label}>{jsonKey}: </h2>}
      {value.length > 0 ? (
        value.map((item, i) => {
          if (Array.isArray(item))
            return <ArrayItem key={`${jsonKey}-${i}`} value={item} />;
          if (typeof item === 'object' && item !== null)
            return <ObjectItem key={`${jsonKey}-${i}`} value={item} />;
          return (
            <li key={i} className={`${styles.value} ${styles.listItem}`}>
              {item}
            </li>
          );
        })
      ) : (
        <li className={`${styles.value} ${styles.listItem}`}>{NO_DATA}</li>
      )}
    </ul>
  </li>
);

/**
 * @param {{
 *   jsonKey?: string
 *   value: {[key: string]: any}
 * }} props
 */
const ObjectItem = ({ jsonKey, value }) => (
  <li className={styles.groupedListItem}>
    <ul className={styles.table}>
      {jsonKey && <h1 className={styles.listTitle}>{jsonKey}</h1>}
      {mapObject(value)}
    </ul>
  </li>
);

/**
 * @param {{
 *   jsonKey: string
 *   value: any
 * }} props
 */
const Item = ({ jsonKey, value }) => {
  const parsedValue = value === NULL ? JSON.parse(value) : value;
  return (
    <li className={styles.listItem}>
      {jsonKey && <span className={styles.label}>{jsonKey}: </span>}
      <span className={styles.value}>{parsedValue || NO_DATA}</span>
    </li>
  );
};

const mapObject = feature => {
  return (
    feature &&
    Object.entries(feature).map(([jsonKey, value], i) => {
      // Parent is always ul, so must always return li
      if (Array.isArray(value)) {
        return (
          <ArrayItem key={`${jsonKey}-${i}`} jsonKey={jsonKey} value={value} />
        );
      } else if (typeof value === OBJECT && value !== null) {
        // When value is object, make new table inside li and map out values
        return (
          <ObjectItem key={`${jsonKey}-${i}`} jsonKey={jsonKey} value={value} />
        );
      }
      //when value is not object or array, parse null values and render li to browser
      return <Item key={`${jsonKey}-${i}`} jsonKey={jsonKey} value={value} />;
    })
  );
};

/**
 * @typedef FeatureDetailProps
 * @property {{[key: string]: any}[]} features
 * @property {string} [title]
 */

/**
 * @param {FeatureDetailProps} props
 */
const FeatureDetail = ({ features, title = DEFAULT_TITLE }) => (
  <div className={styles.featureDetail}>
    <h1 className={styles.header}>{title}</h1>
    <div className={styles.content}>
      {features?.map(feature => (
        <ul key={feature.id} className={styles.list}>
          {mapObject(feature)}
        </ul>
      ))}
    </div>
  </div>
);

export default FeatureDetail;
