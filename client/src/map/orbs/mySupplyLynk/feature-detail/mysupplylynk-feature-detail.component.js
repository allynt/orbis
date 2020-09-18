import React from 'react';

import styles from './mysupplylynk-feature-detail.module.css';

const DEFAULT_TITLE = 'Feature Details';
const NOT_AVAILABLE = 'Not Available';

const getCategoriesString = items => {
  return items.length
    ? items
        .reduce((acc, cur) => [...acc, cur.Category], [])
        .slice()
        .sort()
        .join(', ')
    : [NOT_AVAILABLE];
};

const SingleSupplierContent = ({
  'Address Line 1': AddressLine1,
  'Address Line 2': AddressLine2,
  Postcode,
  URL,
  Items,
}) => (
  <ul className={styles.list}>
    <li className={styles.listItem}>
      <span className={styles.label}>Address Line 1: </span>
      <span className={styles.value}>{AddressLine1 || NOT_AVAILABLE}</span>
    </li>
    <li className={styles.listItem}>
      <span className={styles.label}>Address Line 2: </span>
      <span className={styles.value}>{AddressLine2 || NOT_AVAILABLE}</span>
    </li>
    <li className={styles.listItem}>
      <span className={styles.label}>Postcode: </span>
      <span className={styles.value}>{Postcode || NOT_AVAILABLE}</span>
    </li>
    <li className={styles.listItem}>
      <span className={styles.label}>Website: </span>
      <span className={styles.value}>{URL || NOT_AVAILABLE}</span>
    </li>
    <li className={styles.listItem}>
      <span>
        <span className={styles.label}>Supply Categories:</span>
        {Items && getCategoriesString(Items)}
      </span>
    </li>
    <li className={styles.listItem}>
      <span className={styles.label}>Click for details!</span>
    </li>
  </ul>
);

const MultipleSupplierContent = ({ suppliers }) => (
  <ul className={styles.list}>
    {suppliers.map(supplier => (
      <li className={styles.suppliersListItem}>
        {supplier.Name}
        <p className={styles['suppliersListItem__items']}>
          <span className={styles['suppliersListItem__label']}>
            I can provide:{' '}
          </span>
          {getCategoriesString(supplier.Items)}
        </p>
      </li>
    ))}
  </ul>
);

const MySupplyLynkFeatureDetail = ({ data }) => (
  <div className={styles.featureDetail}>
    <h1 className={styles.header}>
      {data?.length === 1 ? data[0]?.Name : DEFAULT_TITLE}
    </h1>
    <div className={styles.content}>
      {data.length > 1 ? (
        <MultipleSupplierContent suppliers={data} />
      ) : (
        <SingleSupplierContent {...data[0]} />
      )}
    </div>
  </div>
);

export default MySupplyLynkFeatureDetail;
