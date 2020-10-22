import React from 'react';

import { Button, Select } from '@astrosat/astrosat-ui';

import { yupResolver } from '@hookform/resolvers/yup';
import { format } from 'date-fns';
import { Controller, useForm } from 'react-hook-form';
import { object as yupObject } from 'yup';

import { FieldError } from 'components/field-error/field-error.component';
import { Field } from 'components/field/field.component';
import { customerName, FIELD_NAMES } from 'utils/validators';
import { DATE_FORMAT, TRIAL_PERIOD_END_DATE } from '../customer.constants';

import styles from './customer-registration.module.css';

const ORGANISATION_TYPES = [
  { name: 'None', value: undefined },
  { name: 'Non-Profit Organisation', value: 'NON_PROFIT' },
  { name: 'Local Authority', value: 'LOCAL_AUTHORITY' },
  { name: 'Government & Executive Agencies', value: 'GOV_AND_EXEC_AGENCIES' },
  { name: 'Non Departmental Public Body', value: 'NON_DEPT_PUBLIC_BODY' },
  { name: 'Public Corporation', value: 'PUBLIC_CORP' },
  { name: 'Health & Care', value: 'HEALTH_AND_CARE' },
  { name: 'Charity', value: 'CHARITY' },
  {
    name: 'Academics, School or any kind of Education',
    value: 'ACADEMICS_OR_EDUCATION',
  },
  { name: 'Other', value: 'OTHER' },
];

const validationSchema = yupObject({
  [FIELD_NAMES.customerName]: customerName,
});

/**
 * @typedef FormValues
 * @property {string} email
 * @property {string} customerName
 * @property {string} customerNameOfficial
 * @property {string} customerType
 * @property {string} registeredNumber
 * @property {'ORBIS Core'} licence
 * @property {number} numberOfLicences
 * @property {string} subscriptionPeriod
 */

/**
 * @param {{
 *  email: string
 *  onSubmit?: (values: FormValues) => void
 * }} props
 */
const CustomerRegistration = ({ email, onSubmit }) => {
  const { control, errors, formState, handleSubmit, register } = useForm({
    defaultValues: {
      email,
      licence: 'ORBIS Core',
      numberOfLicences: 10,
      subscriptionPeriod: format(TRIAL_PERIOD_END_DATE, DATE_FORMAT),
    },
    resolver: yupResolver(validationSchema),
  });

  /** @param {FormValues} values */
  const transformValues = values => {
    onSubmit({
      ...values,
      numberOfLicences: Number(values.numberOfLicences),
      subscriptionPeriod: TRIAL_PERIOD_END_DATE.toISOString(),
    });
  };

  return (
    <form style={{ height: '100%' }} onSubmit={handleSubmit(transformValues)}>
      <p className={styles.paragraph}>
        <b>Welcome to Orbis.</b> Please complete your account details to
        continue on your path to explore Orbis data. The form below will
        complete your account and allow you to subscribe to your first Orb.
        Additional Orbs will be available through the in-application store when
        it goes live in a future release.
      </p>
      <Field
        register={register}
        name={FIELD_NAMES.email}
        label="Work Email Address"
        readOnly
        errors={errors}
        helpText="You will become the ADMIN for this Team Account. The email address and
        password you have provided will also serve as your ADMIN account. You
        will be able to access the Admin Console. Don’t worry, we will help you
        find it!"
      />
      <Field
        register={register}
        name={FIELD_NAMES.customerName}
        label="Organisation Name*"
        errors={errors}
        autoFocus
      />
      <Field
        register={register}
        name={FIELD_NAMES.customerNameOfficial}
        label="Organisation Official Name"
        errors={errors}
      />
      <Controller
        control={control}
        name={FIELD_NAMES.customerType}
        render={({ onChange, ...rest }) => (
          <div className={styles.field}>
            <label className={styles.label} htmlFor={FIELD_NAMES.customerType}>
              Type of Organisation
            </label>
            <Select
              id={FIELD_NAMES.customerType}
              options={ORGANISATION_TYPES}
              onChange={e => onChange(e.target.value)}
              {...rest}
            />
            <FieldError message={errors?.[FIELD_NAMES.customerType]?.message} />
          </div>
        )}
      />
      <Field
        register={register}
        name={FIELD_NAMES.registeredNumber}
        label="Registered Number"
        errors={errors}
      />
      <Field
        register={register}
        name="licence"
        label="Licence"
        errors={errors}
        readOnly
      />
      <Field
        register={register}
        name="numberOfLicences"
        label="Number of Licences"
        errors={errors}
        readOnly
      />
      <Field
        register={register}
        name="subscriptionPeriod"
        label="Free Trial Subscription Period Ends"
        errors={errors}
        readOnly
      />
      <Button
        className={styles.submit}
        type="submit"
        disabled={!formState.isDirty || Object.keys(errors).length}
      >
        Next
      </Button>
    </form>
  );
};

export default CustomerRegistration;
