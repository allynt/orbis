import React from 'react';

import {
  Button,
  CircularProgress,
  MenuItem,
  TextField,
  Typography,
} from '@astrosat/astrosat-ui';

import { yupResolver } from '@hookform/resolvers/yup';
import { format } from 'date-fns';
import { Controller, useForm } from 'react-hook-form';
import { object as yupObject } from 'yup';

import { ErrorWell } from 'accounts/error-well.component';
import { Form } from 'components';
import { customerName, FIELD_NAMES } from 'utils/validators';

import { DATE_FORMAT, TRIAL_PERIOD_END_DATE } from '../customer.constants';

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
 * @property {import('typings').CustomerType} customerType
 * @property {string} registeredNumber
 * @property {'ORBIS Core'} licence
 * @property {number} numberOfLicences
 * @property {string} subscriptionPeriod
 */

/**
 * @param {{
 *  email: string
 *  isLoading?: boolean
 *  serverErrors?: string[]
 *  onSubmit?: (values: FormValues) => void
 * }} props
 */
const CustomerRegistration = ({
  email,
  isLoading = false,
  serverErrors,
  onSubmit,
}) => {
  const { errors, formState, handleSubmit, register, control } = useForm({
    defaultValues: {
      email,
      customerType: '',
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
    <Form onSubmit={handleSubmit(transformValues)}>
      <Typography style={{ textAlign: 'center' }} paragraph>
        <b>Welcome to Orbis.</b> Please complete your account details to
        continue on your path to explore Orbis data. The form below will
        complete your account and allow you to subscribe to your first Orb.
        Additional Orbs will be available through the in-application store when
        it goes live in a future release.
      </Typography>
      <ErrorWell errors={serverErrors} />
      <Form.Row>
        <TextField
          id={FIELD_NAMES.email}
          name={FIELD_NAMES.email}
          label="Work Email Address"
          inputRef={register}
          InputProps={{ readOnly: true }}
          error={!!errors[FIELD_NAMES.email]}
          helperText={
            'You will become the ADMIN for this Team Account. The email address and password you have provided will also serve as your ADMIN account. You will be able to access the Admin Console. Don’t worry, we will help you find it!'
          }
        />
      </Form.Row>
      <Form.Row>
        <TextField
          id={FIELD_NAMES.customerName}
          name={FIELD_NAMES.customerName}
          label="Organisation Name"
          inputRef={register}
          error={!!errors[FIELD_NAMES.customerName]}
          helperText={errors[FIELD_NAMES.customerName]?.message}
          required
          autoFocus
        />
      </Form.Row>
      <Form.Row>
        <TextField
          id={FIELD_NAMES.customerNameOfficial}
          name={FIELD_NAMES.customerNameOfficial}
          label="Organisation Official Name"
          inputRef={register}
          error={!!errors[FIELD_NAMES.customerNameOfficial]}
          helperText={errors[FIELD_NAMES.customerNameOfficial]?.message}
        />
      </Form.Row>
      <Form.Row>
        <Controller
          control={control}
          name={FIELD_NAMES.customerType}
          as={
            <TextField
              id={FIELD_NAMES.customerType}
              select
              label="Type of Organisation"
              error={!!errors[FIELD_NAMES.customerType]}
              helperText={errors[FIELD_NAMES.customerType]?.message}
            >
              {ORGANISATION_TYPES.map(({ name, value }) => (
                <MenuItem key={name} value={value}>
                  {name}
                </MenuItem>
              ))}
            </TextField>
          }
        />
      </Form.Row>
      <Form.Row>
        <TextField
          id={FIELD_NAMES.registeredNumber}
          name={FIELD_NAMES.registeredNumber}
          label="Registered Number"
          inputRef={register}
          error={!!errors[FIELD_NAMES.registeredNumber]}
          helperText={errors[FIELD_NAMES.registeredNumber]?.message}
        />
      </Form.Row>
      <Form.Row>
        <TextField
          id="licence"
          name="licence"
          label="Licence"
          inputRef={register}
          InputProps={{ readOnly: true }}
        />
      </Form.Row>
      <Form.Row>
        <TextField
          id="numberOfLicences"
          name="numberOfLicences"
          label="Number of Licences"
          inputRef={register}
          InputProps={{ readOnly: true }}
        />
      </Form.Row>
      <Form.Row>
        <TextField
          id="subscriptionPeriod"
          name="subscriptionPeriod"
          label="Free Trial Subscription Period Ends"
          inputRef={register}
          InputProps={{ readOnly: true }}
        />
      </Form.Row>
      <Form.Row centered>
        <Button
          type="submit"
          disabled={!formState.isDirty || !!Object.keys(errors).length}
        >
          {isLoading ? <CircularProgress color="inherit" size={24} /> : 'Next'}
        </Button>
      </Form.Row>
    </Form>
  );
};

export default CustomerRegistration;
