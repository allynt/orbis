import React from 'react';

import { useForm, Button, Textfield } from '@astrosat/astrosat-ui';

import validate from './corporate-account.validator';

import ContentWrapper from '../../content-wrapper.component';

import { Field } from '../corporate-view.component';

import styles from '../corporate-view.module.css';

const CorporateAccount = ({ customer }) => {
  const { handleChange, handleSubmit, values, errors } = useForm(onSubmit, validate);

  function onSubmit() {
    console.log('Values: ', values);
  }

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

        <fieldset>
          <legend className={styles.fieldTitle}>Full Address</legend>

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
        </fieldset>
        <Button theme="tertiary" type="submit">
          Update Changes
        </Button>
      </form>
    </ContentWrapper>
  );
};

export default CorporateAccount;
