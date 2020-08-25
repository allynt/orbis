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
    <h3>Contact Details</h3>
    <ul>
      <li>{supplier['Contact Name']}</li>
      <li>{supplier['Contact Email Address']}</li>
      <li>{supplier['Contact Phone Number']}</li>
      <li>{supplier.URL}</li>
    </ul>
    <h3>Address</h3>
    <ul>
      <li>{supplier['Address Line 1']}</li>
      <li>{supplier['Address Line 2']}</li>
      <li>{supplier.City}</li>
      <li>{supplier.County}</li>
      <li>{supplier.Postcode}</li>
    </ul>
    <h2 className={styles.heading}>{COPY.businessInformationHeading}</h2>
    <h3>Existing line of business</h3>
    <p>{supplier['Line of Business']}</p>
    <h3>New Product Lines in Response to COVID-19</h3>
    <p>{supplier['New Product Lines']}</p>
    <h3>Payment Terms</h3>
    <p>{supplier['Payment Terms']}</p>
    <h2 className={styles.heading}>{COPY.itemsHeading}</h2>
    {supplier.Items.map(({ Name, ...rest }) => (
      <>
        <h3>{Name}</h3>
        <dl>
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
);
