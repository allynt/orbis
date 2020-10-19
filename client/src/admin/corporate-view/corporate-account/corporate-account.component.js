import React from 'react';

import { useForm } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { Textfield, Button } from '@astrosat/astrosat-ui';

import ContentWrapper from '../../content-wrapper.component';

import { DefaultCustomerLogo } from '../../default-customer-logo.component';

import { Field } from '../corporate-form-field.component';
import { FieldError } from 'components/field-error/field-error.component';

import { FIELD_NAMES, name } from 'utils/validators';

import styles from '../corporate-view.module.css';

const corporateAccountSchema = yup.object({
  [FIELD_NAMES.name]: name,
});

const CorporateAccount = ({ customer, updateCustomer }) => {
  function onSubmit(values) {
    let newCustomer = { ...customer, ...values };
    updateCustomer(newCustomer);
  }

  const { register, handleSubmit, errors, formState } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(corporateAccountSchema),
    defaultValues: customer,
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
              alt={`${customer?.title} Logo`}
            />
          ) : (
            <DefaultCustomerLogo className={styles.logo} />
          )}
        </div>

        <Field>
          <div className={styles.field}>
            <label htmlFor={FIELD_NAMES.name} className={styles.fieldLabel}>
              Name:
            </label>
            <Textfield
              id={FIELD_NAMES.name}
              name={FIELD_NAMES.name}
              placeholder="Add Name"
              ref={register}
            />
            {errors.name && (
              <div className={styles.errorContainer}>
                <FieldError message={errors.name.message} />
              </div>
            )}
          </div>
        </Field>

        <legend className={styles.fieldTitle}>Full Address</legend>

        <Field>
          <div className={styles.field}>
            <label htmlFor={FIELD_NAMES.country} className={styles.fieldLabel}>
              Country:
            </label>
            <Textfield
              id={FIELD_NAMES.country}
              name={FIELD_NAMES.country}
              placeholder="Add Country"
              ref={register}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor={FIELD_NAMES.address} className={styles.fieldLabel}>
              Street &amp; House Number:
            </label>
            <Textfield
              id={FIELD_NAMES.address}
              name={FIELD_NAMES.address}
              placeholder="Add Address"
              ref={register}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor={FIELD_NAMES.postcode} className={styles.fieldLabel}>
              Postcode:
            </label>
            <Textfield
              id={FIELD_NAMES.postcode}
              name={FIELD_NAMES.postcode}
              placeholder="Add Postcode"
              ref={register}
            />
          </div>
        </Field>

        <Button
          type="submit"
          disabled={Object.keys(errors).length > 0 || !formState.isDirty}
        >
          Update Changes
        </Button>
      </form>
    </ContentWrapper>
  );
};

export default CorporateAccount;
