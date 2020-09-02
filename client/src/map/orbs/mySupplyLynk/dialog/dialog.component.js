import React, { forwardRef, useRef } from 'react';
import ReactDOM from 'react-dom';

import styles from './dialog.module.css';
import { Button, CloseButton } from '@astrosat/astrosat-ui';

const LABELS = {
  businessInformationHeading: 'Business Information',
  itemsHeading: 'What can we supply?',
  contactDetailsLabel: 'Contact Details',
  addressLabel: 'Address',
  existingLineOfBusinessLabel: 'Existing line of business',
  newProductLinesLabel: 'New Product Lines in Response to COVID-19',
  paymentTermsLabel: 'Payment Terms',
};

export const Dialog = forwardRef(
  ({ supplier, onCloseClick, isVisible }, ref) => {
    const overlayRef = useRef(null);
    return isVisible
      ? ReactDOM.createPortal(
          <div
            className={styles.modal}
            onClick={event => {
              if (overlayRef.current === event.target) {
                onCloseClick();
              }
            }}
            ref={overlayRef}
          >
            <div className={styles.dialog} ref={ref}>
              <header className={styles.header}>
                <h1 className={styles.title}>{supplier.Name || 'Supplier'}</h1>
                <CloseButton
                  className={styles.closeButton}
                  onClick={onCloseClick}
                />
              </header>
              <div className={styles.content}>
                <div className={styles.label}>
                  <h3>{LABELS.contactDetailsLabel}</h3>
                </div>
                <ul className={styles.item}>
                  <li className={styles.listItem}>
                    {supplier['Contact Name']}
                  </li>
                  <li className={styles.listItem}>
                    {supplier['Contact Email Address']}
                  </li>
                  <li className={styles.listItem}>
                    {supplier['Contact Phone Number']}
                  </li>
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
                  <h3>{LABELS.addressLabel}</h3>
                </div>
                <ul className={styles.item}>
                  <li className={styles.listItem}>
                    {supplier['Address Line 1']}
                  </li>
                  <li className={styles.listItem}>
                    {supplier['Address Line 2']}
                  </li>
                  <li className={styles.listItem}>{supplier.City}</li>
                  <li className={styles.listItem}>{supplier.County}</li>
                  <li className={styles.listItem}>{supplier.Postcode}</li>
                </ul>
                <h2 className={styles.heading}>
                  {LABELS.businessInformationHeading}
                </h2>
                <div className={styles.label}>
                  <h3>{LABELS.existingLineOfBusinessLabel}</h3>
                </div>
                <p className={styles.item}>{supplier['Line of Business']}</p>
                <div className={`${styles.label} ${styles.highlight}`}>
                  <h3>{LABELS.newProductLinesLabel}</h3>
                </div>
                <p className={`${styles.item} ${styles.highlight}`}>
                  {supplier['New Product Lines']}
                </p>
                <div className={styles.label}>
                  <h3>{LABELS.paymentTermsLabel}</h3>
                </div>
                <p className={styles.item}>{supplier['Payment Terms']}</p>
                <h2 className={styles.heading}>{LABELS.itemsHeading}</h2>
                {supplier.Items.map(({ Name, ...rest }) => (
                  <>
                    <div className={styles.label}>
                      <h3>{Name}</h3>
                    </div>
                    <dl className={styles.item}>
                      {Object.entries(rest).map(([key, value]) => (
                        <div className={styles.listItem} key={key}>
                          <dt className={styles.dt}>{key}</dt>
                          <dd>{value}</dd>
                        </div>
                      ))}
                    </dl>
                  </>
                ))}
              </div>
            </div>
          </div>,
          document.body,
        )
      : null;
  },
);
