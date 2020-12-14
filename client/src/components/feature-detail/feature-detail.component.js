import React from 'react';

import { DEFAULT_TITLE, VALUE_TYPE } from './feature-detail.constants';

import styles from './feature-detail.module.css';

const NO_DATA = 'Not available';

/**
 * @typedef {import('./feature-detail.constants').ValueType} ValueType
 */
/**
 * @param {*} value
 * @returns {ValueType[keyof ValueType]}
 */
const getTypeForValue = value => {
  if (Array.isArray(value)) return VALUE_TYPE.array;
  if (typeof value === 'object' && value !== null) return VALUE_TYPE.object;
  return VALUE_TYPE.item;
};

/**
 * @param {*} value
 */
const renderItemValue = value => {
  let toRender = value;
  if (value === 'null') toRender = JSON.parse(value);
  if (typeof value === 'boolean') toRender = JSON.stringify(value);
  if (value === 0) toRender = '0';
  return toRender || NO_DATA;
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
      {mapObject(value, undefined)}
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
            case VALUE_TYPE.array:
              return <ArrayItem key={`${jsonKey}-${i}`} value={item} />;
            case VALUE_TYPE.object:
              return <ObjectItem key={`${jsonKey}-${i}`} value={item} />;
            case VALUE_TYPE.item:
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

const mapObject = (feature, footer) => {
  return (
    <>
      {feature &&
        Object.entries(feature).map(([jsonKey, value], i) => {
          switch (getTypeForValue(value)) {
            case VALUE_TYPE.array:
              return (
                <ArrayItem
                  key={`${jsonKey}-${i}`}
                  jsonKey={jsonKey}
                  value={value}
                />
              );
            case VALUE_TYPE.object:
              return (
                <ObjectItem
                  key={`${jsonKey}-${i}`}
                  jsonKey={jsonKey}
                  value={value}
                />
              );
            case VALUE_TYPE.item:
            default:
              return (
                <Item key={`${jsonKey}-${i}`} jsonKey={jsonKey} value={value} />
              );
          }
        })}
      {footer && (
        <li className={styles.listItem}>
          {<span className={styles.label}>{footer.label}</span>}
          <span className={styles.value}>{footer.content}</span>
        </li>
      )}
    </>
  );
};

/**
 * @typedef FeatureDetailProps
 * @property {{[key: string]: any}[]} [features]
 * @property {React.ReactNode} [children]
 * @property {string} [title]
 * @property {object} [footer]
 */

/**
 * @param {FeatureDetailProps} props
 */
const FeatureDetail = ({
  children,
  features,
  title = DEFAULT_TITLE,
  footer,
}) => (
  <div className={styles.featureDetail}>
    <h1 className={styles.header}>{title}</h1>
    <div className={styles.content}>
      {features &&
        features?.map(feature => (
          <ul key={feature.id} className={styles.list}>
            {mapObject(feature, footer)}
          </ul>
        ))}
      {children && children}
    </div>
  </div>
);

export default FeatureDetail;
