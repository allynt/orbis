import React from 'react';

import styles from './mysupplylynk-feature-detail.module.css';
import { LAYERS } from '../../slices/mysupplylynk.constants';

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

const SingleSupplierContent = ({ id, data }) => (
  <ul className={styles.list}>
    {Object.keys(data).map(key => {
      if (Array.isArray(data[key])) {
        return (
          <li className={styles.listItem}>
            <span className={styles.label}>{key}: </span>
            <span className={styles.value}>
              {getCategoriesString(data[key])}
            </span>
          </li>
        );
      } else {
        return (
          <li className={styles.listItem}>
            <span className={styles.label}>{key}</span>
            <span className={styles.value}>{data[key] || NOT_AVAILABLE}</span>
          </li>
        );
      }
    })}
    <li className={styles.listItem}>
      {id === LAYERS.suppliers || id === LAYERS.cqc ? (
        <span className={styles.label}>Click for details!</span>
      ) : (
        <>
          <span className={styles.value}>Register now at </span>
          <span className={styles.label}>www.MySupplyLynk.net</span>
        </>
      )}
    </li>
  </ul>
);

const MultipleSupplierContent = ({ id, suppliers, onSupplierClick }) => (
  <ul className={styles.list}>
    {suppliers.map(supplier => (
      <li
        key={`${supplier.Name}${supplier.Postcode}`}
        className={styles.suppliersListItem}
        onClick={e => onSupplierClick(supplier, e)}
      >
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

const MySupplyLynkFeatureDetail = ({ id, data, onSupplierClick }) => {
  return (
    <div className={styles.featureDetail}>
      <h1 className={styles.header}>
        {data?.length === 1 ? data[0]?.Company || DEFAULT_TITLE : DEFAULT_TITLE}
      </h1>
      <div className={styles.content}>
        {data.length > 1 ? (
          <MultipleSupplierContent
            id={id}
            suppliers={data}
            onSupplierClick={onSupplierClick}
          />
        ) : (
          <SingleSupplierContent id={id} data={data[0]} />
        )}
      </div>
    </div>
  );
};

export default MySupplyLynkFeatureDetail;
