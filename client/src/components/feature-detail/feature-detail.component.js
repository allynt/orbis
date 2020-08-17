import React from 'react';

import styles from './feature-detail.module.css';
import { DEFAULT_TITLE } from './feature-detail.constants';

const NULL = 'null';
const NO_DATA = 'Not available';

/**
 * @param {*} value
 * @returns {'array' | 'object' | 'item'}
 */
const getTypeForValue = value => {
  if (Array.isArray(value)) return 'array';
  if (typeof value === 'object' && value !== null) return 'object';
  return 'item';
};

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

const renderItemValue = value => {
  let toRender = value;
  if (value === NULL) toRender = JSON.parse(value);
  if (typeof value === 'boolean') toRender = JSON.stringify(value);
  if (value === 0) toRender = '0';
  return toRender || NO_DATA;
};

/**
 * @param {{
 *   jsonKey: string
 *   value: any
 * }} props
 */
const Item = ({ jsonKey, value }) => {
  return (
    <li className={styles.listItem}>
      {jsonKey && <span className={styles.label}>{jsonKey}: </span>}
      <span className={styles.value}>{renderItemValue(value)}</span>
    </li>
  );
};

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
          switch (getTypeForValue(item)) {
            case 'array':
              return <ArrayItem key={`${jsonKey}-${i}`} value={item} />;
            case 'object':
              return <ObjectItem key={`${jsonKey}-${i}`} value={item} />;
            case 'item':
            default:
              return (
                <li key={i} className={`${styles.value} ${styles.listItem}`}>
                  {renderItemValue(item)}
                </li>
              );
          }
        })
      ) : (
        <li className={`${styles.value} ${styles.listItem}`}>{NO_DATA}</li>
      )}
    </ul>
  </li>
);

const mapObject = feature => {
  return (
    feature &&
    Object.entries(feature).map(([jsonKey, value], i) => {
      switch (getTypeForValue(value)) {
        case 'array':
          return (
            <ArrayItem
              key={`${jsonKey}-${i}`}
              jsonKey={jsonKey}
              value={value}
            />
          );
        case 'object':
          return (
            <ObjectItem
              key={`${jsonKey}-${i}`}
              jsonKey={jsonKey}
              value={value}
            />
          );
        case 'item':
        default:
          return (
            <Item key={`${jsonKey}-${i}`} jsonKey={jsonKey} value={value} />
          );
      }
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
