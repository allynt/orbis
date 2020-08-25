import React from 'react';

import styles from './dialog.module.css';
import { Button, CloseButton } from '@astrosat/astrosat-ui';

const COPY = {
  businessInformationHeading: 'Business Information',
  itemsHeading: 'What can we supply?',
};

/**
 *
 * @param {{
 *   supplier?: any
 *   onCloseClick: (event: React.MouseEvent<HTMLButtonElement>) => void
 * }} props
 */
export const Dialog = ({ supplier, onCloseClick }) => (
  <div className={styles.dialog}>
    <header className={styles.header}>
      <h1 className={styles.title}>{supplier.Name || 'Supplier'}</h1>
      <CloseButton className={styles.closeButton} onClick={onCloseClick} />
    </header>
    <div className={styles.content}>
      <div className={styles.label}>
        <h3>Contact Details</h3>
      </div>
      <ul className={styles.item}>
        <li className={styles.listItem}>{supplier['Contact Name']}</li>
        <li className={styles.listItem}>{supplier['Contact Email Address']}</li>
        <li className={styles.listItem}>{supplier['Contact Phone Number']}</li>
        <li className={styles.listItem}>
          <Button
            className={styles.link}
            href={supplier.URL}
            target="_blank"
            rel="noreferrer noopener"
          >
            {supplier.URL}
          </Button>
        </li>
      </ul>
      <div className={styles.label}>
        <h3>Address</h3>
      </div>
      <ul className={styles.item}>
        <li className={styles.listItem}>{supplier['Address Line 1']}</li>
        <li className={styles.listItem}>{supplier['Address Line 2']}</li>
        <li className={styles.listItem}>{supplier.City}</li>
        <li className={styles.listItem}>{supplier.County}</li>
        <li className={styles.listItem}>{supplier.Postcode}</li>
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
              <div className={styles.listItem}>
                <dt className={styles.dt}>{key}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </>
      ))}
    </div>
  </div>
);
