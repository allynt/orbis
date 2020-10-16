import React from 'react';

import { useForm } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { Textfield, Button } from '@astrosat/astrosat-ui';

import ContentWrapper from '../../content-wrapper.component';

import { DefaultCustomerLogo } from '../../default-customer-logo.component';

import { Field } from '../corporate-view.component';
import { FieldError } from 'accounts/field-error.component';

import { FIELD_NAMES, name } from 'utils/validators';

import styles from '../corporate-view.module.css';

const loginSchema = yup.object({
  [FIELD_NAMES.name]: name,
});

const CorporateAccount = ({ customer, updateCustomer }) => {
  const formFields = ['address', 'country', 'name', 'postcode'];

  const getDefaults = () => {
    let defaults = {};
    formFields.forEach(field => {
      if (customer[field]) {
        defaults = { ...defaults, [field]: customer[field] };
      }
    });
    return defaults;
  };

  function onSubmit(values) {
    let newCustomer = { ...customer };
    formFields.forEach(field => {
      if (values[field]) {
        newCustomer = { ...newCustomer, [field]: values[field] };
      }
    });
    updateCustomer(newCustomer);
  }

  const { register, handleSubmit, errors, formState } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(loginSchema),
    defaultValues: getDefaults(),
  });

  return (
    <ContentWrapper title="Corporate Account">
      <form
        className={styles.corporateAccount}
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className={styles.logoContainer}>
          {customer?.logo ? (
            <img
              src={customer.logo}
              className={styles.logo}
              alt="Organisation Logo"
            />
          ) : (
            <DefaultCustomerLogo className={styles.logo} />
          )}
        </div>

        <Field>
          <div className={styles.field}>
            <label htmlFor="name" className={styles.fieldLabel}>
              Name:
            </label>
            <Textfield
              id="name"
              name="name"
              placeholder="Add Name"
              ref={register}
            />
          </div>
        </Field>

        <fieldset>
          <legend className={styles.fieldTitle}>Full Address</legend>

          <Field>
            <div className={styles.field}>
              <label htmlFor="country" className={styles.fieldLabel}>
                Country:
              </label>
              <Textfield
                id="country"
                name="country"
                placeholder="Add Country"
                ref={register}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="address" className={styles.fieldLabel}>
                Street &amp; House Number:
              </label>
              <Textfield
                id="address"
                name="address"
                placeholder="Add Address"
                ref={register}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="postcode" className={styles.fieldLabel}>
                Postcode:
              </label>
              <Textfield
                id="postcode"
                name="postcode"
                placeholder="Add Postcode"
                ref={register}
              />
            </div>
          </Field>
        </fieldset>
        {errors.name && <FieldError message={errors.name.message} />}
        <Button type="submit" disabled={!formState.isDirty}>
          Update Changes
        </Button>
      </form>
    </ContentWrapper>
  );
};

export default CorporateAccount;
