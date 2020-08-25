import React from 'react';

import styles from './dialog.module.css';

const COPY = {
  businessInformationHeading: 'Business Information',
  itemsHeading: 'What can we supply?',
};

/**
 *
 * @param {{
 *   supplier?: any
 * }} props
 */
export const Dialog = ({ supplier }) => (
  <div className={styles.dialog}>
    <header className={styles.header}>
      <h1 className={styles.title}>{supplier.Name || 'Supplier'}</h1>
    </header>
    <div className={styles.content}>
      <div className={styles.label}>
        <h3>Contact Details</h3>
      </div>
      <ul className={styles.item}>
        <li>{supplier['Contact Name']}</li>
        <li>{supplier['Contact Email Address']}</li>
        <li>{supplier['Contact Phone Number']}</li>
        <li>
          <a href={supplier.URL} target="_blank" rel="noreferrer noopener">
            {supplier.URL}
          </a>
        </li>
      </ul>
      <div className={styles.label}>
        <h3>Address</h3>
      </div>
      <ul className={styles.item}>
        <li>{supplier['Address Line 1']}</li>
        <li>{supplier['Address Line 2']}</li>
        <li>{supplier.City}</li>
        <li>{supplier.County}</li>
        <li>{supplier.Postcode}</li>
      </ul>
      <h2 className={styles.heading}>{COPY.businessInformationHeading}</h2>
      <div className={styles.label}>
        <h3>Existing line of business</h3>
      </div>
      <p className={styles.item}>{supplier['Line of Business']}</p>
      <div className={`${styles.label} ${styles.highlight}`}>
        <h3>New Product Lines in Response to COVID-19</h3>
      </div>
      <p className={`${styles.item} ${styles.highlight}`}>
        {supplier['New Product Lines']}
      </p>
      <div className={styles.label}>
        <h3>Payment Terms</h3>
      </div>
      <p className={styles.item}>{supplier['Payment Terms']}</p>
      <h2 className={styles.heading}>{COPY.itemsHeading}</h2>
      {supplier.Items.map(({ Name, ...rest }) => (
        <>
          <div className={styles.label}>
            <h3>{Name}</h3>
          </div>
          <dl className={styles.item}>
            {Object.entries(rest).map(([key, value]) => (
              <>
                <dt>{key}</dt>
                <dd>{value}</dd>
              </>
            ))}
          </dl>
        </>
      ))}
    </div>
  </div>
);
