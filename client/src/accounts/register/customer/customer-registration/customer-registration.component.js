import { Button, Select } from '@astrosat/astrosat-ui';
import { format } from 'date-fns';
import { Field } from 'components/field/field.component';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { customerName, FIELD_NAMES } from 'utils/validators';
import { object as yupObject } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const ORGANISATION_TYPES = [
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

const APRIL_THIRTYFIRST_TWENTYTWENTYONE = new Date(2021, 3, 1);

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
      subscriptionPeriod: format(
        APRIL_THIRTYFIRST_TWENTYTWENTYONE,
        'do MMMM yyyy',
      ),
    },
    resolver: yupResolver(validationSchema),
  });

  /** @param {FormValues} values */
  const transformValues = values => {
    onSubmit({
      ...values,
      numberOfLicences: +values.numberOfLicences,
      subscriptionPeriod: APRIL_THIRTYFIRST_TWENTYTWENTYONE.toISOString(),
    });
  };

  return (
    <form onSubmit={handleSubmit(transformValues)}>
      <Field
        register={register}
        name={FIELD_NAMES.email}
        label="Work Email Address"
        readOnly
        errors={errors}
      />
      <Field
        register={register}
        name={FIELD_NAMES.customerName}
        label="Organisation Name*"
        errors={errors}
      />
      <Field
        register={register}
        name={FIELD_NAMES.customerNameOfficial}
        label="Organisation Official Name"
        errors={errors}
      />
      <label htmlFor={FIELD_NAMES.customerType}>Type of Organisation</label>
      <Controller
        control={control}
        name={FIELD_NAMES.customerType}
        render={({ onChange, ...rest }) => (
          <Select
            id={FIELD_NAMES.customerType}
            options={ORGANISATION_TYPES}
            onChange={e => onChange(e.target.value)}
            {...rest}
          />
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
        type="submit"
        disabled={!formState.isDirty || Object.keys(errors).length}
      >
        Next
      </Button>
    </form>
  );
};

export default CustomerRegistration;
