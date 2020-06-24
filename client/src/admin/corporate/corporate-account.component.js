import React from 'react';

import { useForm, Button, Textfield, Radio } from '@astrosat/astrosat-ui';

import validate from './corporate-account.validator';

import ContentWrapper from '../content-wrapper.component';

import styles from './corporate.module.css';

const CorporateAccount = ({ customer }) => {
  const { handleChange, handleSubmit, values, errors } = useForm(onSubmit, validate);

  function onSubmit() {
    console.log('Values: ', values);
  }

  const Field = ({ children }) => <div className={styles.fieldContainer}>{children}</div>;

  return (
    <ContentWrapper title={'Corporate Account'}>
      <form className={styles.corporateAccount} onSubmit={handleSubmit}>
        <div className={styles.logoContainer}>
          <img src={customer.logo} className={styles.logo} alt="Organisation Logo" />
          <Button theme="link" onClick={() => console.log('Upload new image!')}>
            Upload new image
          </Button>
          <Button theme="link" onClick={() => console.log('Remove!')}>
            Remove
          </Button>
        </div>

        <fieldset>
          <Field>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Name:</label>
              <Textfield
                name="name"
                value={values.name || customer.title}
                onChange={handleChange}
                placeholder="Add Name"
              />
            </div>
          </Field>

          <h2 className={styles.fieldTitle}>Full Address</h2>

          <Field>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Country:</label>
              <Textfield
                name="country"
                value={values.country || ''}
                onChange={handleChange}
                placeholder="Add Country"
              />
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Street &amp; House Number:</label>
              <Textfield
                name="streetAndNumber"
                value={values.streetAndNumber || ''}
                onChange={handleChange}
                placeholder="Add Address"
              />
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Postcode:</label>
              <Textfield
                name="postcode"
                value={values.postcode || ''}
                onChange={handleChange}
                placeholder="Add Postcode"
              />
            </div>
          </Field>

          <h2 className={styles.fieldTitle}>VAT Info</h2>

          <Field>
            <div className={`${styles.field} ${styles.vatField}`}>
              <label className={styles.fieldLabel}>VAT Registered:</label>
              <Radio name="vat" ariaLabel="true" value={values.vat || ''} onChange={handleChange} />
              <Radio name="vat" ariaLabel="false" value={values.vat || ''} onChange={handleChange} />
            </div>

            <div className={styles.field}>
              <label className={styles.fieldLabel}>VAT Number:</label>
              <Textfield
                name="vat number"
                value={values.vatNumber || ''}
                onChange={handleChange}
                placeholder="Add Number"
                disabled={true}
              />
            </div>
          </Field>

          <h2 className={styles.fieldTitle}>Payments Contacts</h2>

          <Field>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Full Name:</label>
              <Textfield name="full name" value={values.name || ''} onChange={handleChange} placeholder="Add Name" />
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Email:</label>
              <Textfield name="email" value={values.email || ''} onChange={handleChange} placeholder="Add Email" />
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Phone:</label>
              <Textfield name="phone" value={values.phone || ''} onChange={handleChange} placeholder="Add Phone" />
            </div>
          </Field>

          <h2 className={styles.fieldTitle}>Storage Info</h2>

          <Field>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Full Storage</label>
              <p>{customer.data_limit} GB</p>
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Used Storage:</label>
              <p>{customer.data_total} GB</p>
            </div>
          </Field>
        </fieldset>

        <div className={styles.paymentID}>
          Payment Account ID:<span className={styles.ID}> 1234-1234-1234</span>
        </div>
        <Button theme="tertiary" type="submit">
          Update Changes
        </Button>
      </form>
    </ContentWrapper>
  );
};

export default CorporateAccount;
