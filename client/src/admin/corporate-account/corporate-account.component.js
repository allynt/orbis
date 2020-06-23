import React, { useState } from 'react';

import { useForm, Button, Textfield, Radio } from '@astrosat/astrosat-ui';

import validate from './corporate-account.validator';

import ContentWrapper from '../content-wrapper.component';

import styles from './corporate-account.module.css';

const CorporateAccount = ({ title, user, customer }) => {
  const { handleChange, handleSubmit, values, errors } = useForm(onSubmit, validate);

  const [vatRegistered, setVatRegistered] = useState(false);

  function onSubmit() {
    console.log('Values: ', values);
  }

  const handleVatChange = (e, cb, bool) => {
    setVatRegistered(bool);
    cb(e);
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
              <Textfield name="name" value={values.name || ''} onChange={handleChange} placeholder="Add Name" />
            </div>
          </div>

          <h2 className={styles.fieldTitle}>Full Address</h2>

          <div className={styles.fieldContainer}>
            <div className={styles.field}>
              <h2 className={styles.fieldKey}>Country:</h2>
              <Textfield
                name="country"
                value={values.country || ''}
                onChange={handleChange}
                placeholder="Add Country"
              />
            </div>
            <div className={styles.field}>
              <h2 className={styles.fieldKey}>Street &amp; House Number:</h2>
              <Textfield
                name="street-house-number"
                value={values.streetAndNumber || ''}
                onChange={handleChange}
                placeholder="Add Address"
              />
            </div>
            <div className={styles.field}>
              <h2 className={styles.fieldKey}>Postcode:</h2>
              <Textfield
                name="postcode"
                value={values.postcode || ''}
                onChange={handleChange}
                placeholder="Add Postcode"
              />
            </div>
          </div>

          <h2 className={styles.fieldTitle}>VAT Info</h2>

          <div className={styles.fieldContainer}>
            <div className={styles.vatField}>
              <h2 className={styles.fieldKey}>VAT Registered:</h2>
              <Radio label="Yes" onChange={e => handleVatChange(e, handleChange, true)} checked={vatRegistered} />
              <Radio label="No" onChange={e => handleVatChange(e, handleChange, false)} checked={!vatRegistered} />
            </div>

            <div className={`${styles.field} ${!vatRegistered && styles.notRegistered}`}>
              <h2 className={styles.fieldKey}>VAT Number:</h2>
              <Textfield
                name="vat number"
                value={values.vatNumber || ''}
                onChange={handleChange}
                placeholder="Add Number"
                disabled={!vatRegistered}
              />
            </div>
          </div>

          <h2 className={styles.fieldTitle}>Payments Contacts</h2>

          <div className={styles.fieldContainer}>
            <div className={styles.field}>
              <h2 className={styles.fieldKey}>Full Name:</h2>
              <Textfield name="full name" value={values.name || ''} onChange={handleChange} placeholder="Add Name" />
            </div>
            <div className={styles.field}>
              <h2 className={styles.fieldKey}>Email:</h2>
              <Textfield name="email" value={values.email || ''} onChange={handleChange} placeholder="Add Email" />
            </div>
            <div className={styles.field}>
              <h2 className={styles.fieldKey}>Phone:</h2>
              <Textfield name="phone" value={values.phone || ''} onChange={handleChange} placeholder="Add Phone" />
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
          <Button theme="tertiary" type="submit">
            Update Changes
          </Button>
        </form>
      </ContentWrapper>

      <ContentWrapper title={'Administrator'} user={user}>
        <form className={styles.corporateAccount} onSubmit={handleSubmit}>
          <div className={styles.logoContainer}>
            <img src={user.avatar} className={styles.logo} alt="Admin Avatar" />
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
              <Textfield name="name" value={values.name || user.name} onChange={handleChange} placeholder="Add Name" />
            </div>
            <div className={styles.field}>
              <h2 className={styles.fieldKey}>Email:</h2>
              <Textfield
                name="email"
                value={values.email || user.email}
                onChange={handleChange}
                placeholder="Add Email"
              />
            </div>
            <div className={styles.field}>
              <h2 className={styles.fieldKey}>Phone:</h2>
              <Textfield
                name="phone"
                value={values.phone || user.phone}
                onChange={handleChange}
                placeholder="Add Phone Number"
              />
            </div>
          </div>

          <div className={styles.fieldContainer}>
            <div className={styles.field}>
              <h2 className={styles.fieldKey}>Role:</h2>
              <Textfield
                name="name"
                value={values.name || user.type}
                onChange={handleChange}
                placeholder="Change Role"
              />
            </div>
          </div>
          <Button theme="tertiary" type="submit">
            Update Changes
          </Button>
        </form>
      </ContentWrapper>
    </div>
  );
};

export default CorporateAccount;
