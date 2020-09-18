import React, { forwardRef, useRef } from 'react';
import ReactDOM from 'react-dom';

import styles from './dialog.module.css';
import { Button, CloseButton } from '@astrosat/astrosat-ui';

const NOT_AVAILABLE = 'Not available';

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
                  data-testid="close-button"
                  className={styles.closeButton}
                  onClick={onCloseClick}
                />
              </header>
              <div className={styles.content}>
                <div className={styles.label}>
                  <h3>{LABELS.contactDetailsLabel}</h3>
                </div>
                <ul className={styles.item}>
                  {supplier['Contact Name'] && (
                    <li className={styles.listItem} data-testid="contact-name">
                      {supplier['Contact Name']}
                    </li>
                  )}
                  {supplier['Contact Email Address'] && (
                    <li className={styles.listItem} data-testid="contact-email">
                      {supplier['Contact Email Address']}
                    </li>
                  )}
                  {supplier['Contact Phone Number'] && (
                    <li className={styles.listItem}>
                      {supplier['Contact Phone Number']}
                    </li>
                  )}
                  {supplier.URL && (
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
                  )}
                </ul>
                <div className={styles.label}>
                  <h3>{LABELS.addressLabel}</h3>
                </div>
                <ul className={styles.item}>
                  {supplier['Address Line 1'] && (
                    <li
                      className={styles.listItem}
                      data-testid="address-line-1"
                    >
                      {supplier['Address Line 1']}
                    </li>
                  )}
                  {supplier['Address Line 2'] && (
                    <li className={styles.listItem}>
                      {supplier['Address Line 2']}
                    </li>
                  )}
                  {supplier.City && (
                    <li className={styles.listItem}>{supplier.City}</li>
                  )}
                  {supplier.County && (
                    <li className={styles.listItem}>{supplier.County}</li>
                  )}
                  {supplier.Postcode && (
                    <li className={styles.listItem}>{supplier.Postcode}</li>
                  )}
                </ul>
                <h2 className={styles.heading}>
                  {LABELS.businessInformationHeading}
                </h2>
                <div className={styles.label}>
                  <h3>{LABELS.existingLineOfBusinessLabel}</h3>
                </div>
                <p className={styles.item}>
                  {supplier['Line of Business'] || NOT_AVAILABLE}
                </p>
                <div className={`${styles.label} ${styles.highlight}`}>
                  <h3>{LABELS.newProductLinesLabel}</h3>
                </div>
                <p className={`${styles.item} ${styles.highlight}`}>
                  {supplier['New Product Lines'] || NOT_AVAILABLE}
                </p>
                <div className={styles.label}>
                  <h3>{LABELS.paymentTermsLabel}</h3>
                </div>
                <p className={styles.item}>
                  {supplier['Payment Terms'] || NOT_AVAILABLE}
                </p>
                <h2 className={styles.heading}>{LABELS.itemsHeading}</h2>
                {supplier.Items.map(({ Name, ...rest }) => (
                  <>
                    <div className={styles.label}>
                      <h3>{Name || NOT_AVAILABLE}</h3>
                    </div>
                    <dl className={styles.item}>
                      {Object.entries(rest).map(([key, value]) => (
                        <div className={styles.listItem} key={key}>
                          <dt className={styles.dt}>{key}</dt>
                          <dd>{value || NOT_AVAILABLE}</dd>
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
