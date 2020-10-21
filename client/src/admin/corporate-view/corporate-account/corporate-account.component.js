import React from 'react';

import { useForm } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { Textfield, Button } from '@astrosat/astrosat-ui';

import ContentWrapper from '../../content-wrapper.component';

import { DefaultCustomerLogo } from '../../default-customer-logo.component';

import { FieldWrapper } from '../field-wrapper.component';
import { FieldError } from 'components/field-error/field-error.component';

import { FIELD_NAMES, customerName } from 'utils/validators';

import styles from '../corporate-view.module.css';

const corporateAccountSchema = yup.object({
  [FIELD_NAMES.customerName]: customerName,
});

const CorporateAccount = ({ customer, updateCustomer }) => {
  function onSubmit(values) {
    const data = {
      name: values.customerName,
      country: values.country,
      address: values.address,
      postcode: values.postcode,
    };
    const newCustomer = { ...customer, ...data };
    updateCustomer(newCustomer);
  }

  const { register, handleSubmit, errors, formState } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(corporateAccountSchema),
    defaultValues: { ...customer, customerName: customer.name },
  });

  return (
    <ContentWrapper title="Corporate Account">
      <form
        className={styles.corporateAccount}
        onSubmit={handleSubmit(onSubmit)}
      >
        {customer?.logo ? (
          <div className={styles.logoContainer}>
            <img
              src={customer.logo}
              className={styles.logo}
              alt={`${customer?.title} Logo`}
            />
          </div>
        ) : (
          <DefaultCustomerLogo />
        )}

        <FieldWrapper>
          <div className={styles.field}>
            <label htmlFor={FIELD_NAMES.name} className={styles.fieldLabel}>
              Name:
              <Textfield
                id={FIELD_NAMES.customerName}
                name={FIELD_NAMES.customerName}
                placeholder="Add Name"
                ref={register}
              />
            </label>
            {errors.customerName && (
              <FieldError message={errors.customerName.message} />
            )}
          </div>
        </FieldWrapper>

        <fieldset>
          <legend className={styles.fieldTitle}>Full Address</legend>

          <FieldWrapper>
            <div className={styles.field}>
              <label
                htmlFor={FIELD_NAMES.country}
                className={styles.fieldLabel}
              >
                Country:
                <Textfield
                  id={FIELD_NAMES.country}
                  name={FIELD_NAMES.country}
                  placeholder="Add Country"
                  ref={register}
                />
              </label>
            </div>
            <div className={styles.field}>
              <label
                htmlFor={FIELD_NAMES.address}
                className={styles.fieldLabel}
              >
                Street &amp; House Number:
                <Textfield
                  id={FIELD_NAMES.address}
                  name={FIELD_NAMES.address}
                  placeholder="Add Address"
                  ref={register}
                />
              </label>
            </div>
            <div className={styles.field}>
              <label
                htmlFor={FIELD_NAMES.postcode}
                className={styles.fieldLabel}
              >
                Postcode:
                <Textfield
                  id={FIELD_NAMES.postcode}
                  name={FIELD_NAMES.postcode}
                  placeholder="Add Postcode"
                  ref={register}
                />
              </label>
            </div>
          </FieldWrapper>
        </fieldset>

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
