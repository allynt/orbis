import React, { useState } from 'react';

import { useForm, Button, Textfield, Radio } from '@astrosat/astrosat-ui';

import validate from './corporate-account.validator';

import ContentWrapper from '../content-wrapper.component';

import styles from './corporate-account.module.css';

const CorporateAccount = ({ title, user, customer }) => {
  const { handleChange, handleSubmit, values, errors } = useForm(onSubmit, validate);

  const [vatRegistered, setVatRegistered] = useState(false);

  function onSubmit() {
    console.log('Submit!');
  }

  const handleVatChange = (cb, bool) => {
    setVatRegistered(bool);
    cb();
  };

  return (
    <div className={styles.contentContainer}>
      <ContentWrapper title={title}>
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

          <div className={styles.fieldContainer}>
            <div className={styles.field}>
              <h2 className={styles.fieldKey}>Name:</h2>
              <Textfield name="name" value={values.name || 'Add Name'} onChange={handleChange} />
            </div>
          </div>

          <h2 className={styles.fieldTitle}>Full Address</h2>

          <div className={styles.fieldContainer}>
            <div className={styles.field}>
              <h2 className={styles.fieldKey}>Country:</h2>
              <Textfield name="country" value={values.country || 'Add Country'} onChange={handleChange} />
            </div>
            <div className={styles.field}>
              <h2 className={styles.fieldKey}>Street &amp; House Number:</h2>
              <Textfield
                name="street-house-number"
                value={values.streetAndNumber || 'Add Address'}
                onChange={handleChange}
              />
            </div>
            <div className={styles.field}>
              <h2 className={styles.fieldKey}>Postcode:</h2>
              <Textfield name="postcode" value={values.postcode || 'Add Postcode'} onChange={handleChange} />
            </div>
          </div>

          <h2 className={styles.fieldTitle}>VAT Info</h2>

          <div className={styles.fieldContainer}>
            <div className={styles.vatField}>
              <h2 className={styles.fieldKey}>VAT Registered:</h2>
              <Radio label="Yes" onChange={() => handleVatChange(handleChange, true)} />
              <Radio label="No" onChange={() => handleVatChange(handleChange, false)} />
            </div>

            <div className={`${styles.field} ${!vatRegistered && styles.notRegistered}`}>
              <h2 className={styles.fieldKey}>VAT Number:</h2>
              <Textfield
                name="vat number"
                value={values.vatNumber || 'Add Number'}
                onChange={handleChange}
                disabled={!vatRegistered}
              />
            </div>
          </div>

          <h2 className={styles.fieldTitle}>Payments Contacts</h2>

          <div className={styles.fieldContainer}>
            <div className={styles.field}>
              <h2 className={styles.fieldKey}>Full Name:</h2>
              <Textfield name="full name" value={values.name || 'Add Name'} onChange={handleChange} />
            </div>
            <div className={styles.field}>
              <h2 className={styles.fieldKey}>Email:</h2>
              <Textfield name="email" value={values.email || 'Add Email'} onChange={handleChange} />
            </div>
            <div className={styles.field}>
              <h2 className={styles.fieldKey}>Phone:</h2>
              <Textfield name="phone" value={values.phone || 'Add Phone'} onChange={handleChange} />
            </div>
          </div>

          <h2 className={styles.fieldTitle}>Storage Info</h2>

          <div className={styles.fieldContainer}>
            <div className={styles.field}>
              <h2 className={styles.fieldKey}>Full Storage</h2>
              <p>{customer.data_limit} GB</p>
            </div>
            <div className={styles.field}>
              <h2 className={styles.fieldKey}>Used Storage:</h2>
              <p>{customer.data_total} GB</p>
            </div>
          </div>

          <div className={styles.paymentID}>
            Payment Account ID:<span className={styles.ID}> 1234-1234-1234</span>
          </div>
        </form>
      </ContentWrapper>

      <ContentWrapper title={'Administrator Profile'} user={user}>
        <h1>{user.name}</h1>
      </ContentWrapper>
    </div>
  );
};

export default CorporateAccount;
