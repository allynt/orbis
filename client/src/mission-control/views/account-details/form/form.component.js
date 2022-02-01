import React, { useEffect } from 'react';

import { Button, makeStyles, MenuItem } from '@astrosat/astrosat-ui';

import { Controller, useForm } from 'react-hook-form';

import { ORGANISATION_TYPES } from 'mission-control/mission-control.constants';
import { TextField } from 'mission-control/shared-components/text-field.component';
import { Wrapper } from 'mission-control/shared-components/wrapper.component';
import { FIELD_NAMES } from 'utils/validators';

const useStyles = makeStyles(theme => ({
  wrapper: { position: 'relative' },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    '& .MuiTextField-root': {
      marginBottom: theme.spacing(1),
      '&:last-of-type': {
        marginBottom: theme.spacing(3),
      },
    },
  },
}));

const mapping = new Map([
  [FIELD_NAMES.customerName, 'name'],
  [FIELD_NAMES.customerType, 'company_type'],
  [FIELD_NAMES.registeredNumber, 'registered_id'],
  [FIELD_NAMES.vatNumber, 'vat_number'],
  [FIELD_NAMES.address, 'address'],
]);

const identifiers = Array.from(mapping.keys()).reduce(
  (acc, fieldIdentifier) => ({
    ...acc,
    [fieldIdentifier]: { id: fieldIdentifier, name: fieldIdentifier },
  }),
  {},
);

const transform = {
  /**
   * @param {Partial<import('typings').Customer>} customer
   * @returns {Record<string,any>}
   */
  in: customer => {
    const result = {};
    mapping.forEach((value, key) => (result[key] = customer[value]));
    return result;
  },
  /**
   * @param {Record<string, any>} values
   * @returns {Partial<import('typings').Customer>}
   */
  out: values => {
    const result = {};
    mapping.forEach((value, key) => (result[value] = values[key]));
    return result;
  },
};

/**
 * @param {{
 *  onSubmit?: (values: Pick<import('typings').Customer,
 *    'address' |
 *    'company_type' |
 *    'name' |
 *    'type' |
 *    'vat_number'>) => void
 *  customer?: Partial<import('typings').Customer>
 *  userEmail?: import('typings').User['email']
 * }} props
 */
export const Form = ({ onSubmit, customer = {}, userEmail = '' }) => {
  const styles = useStyles();

  const {
    handleSubmit,
    reset,
    control,
    formState: { isDirty, isSubmitSuccessful },
  } = useForm({
    defaultValues: transform.in(customer),
  });

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset(transform.in(customer));
    }
  }, [isSubmitSuccessful, reset, customer]);

  return (
    <Wrapper className={styles.wrapper} title="Account Details">
      <form
        className={styles.form}
        onSubmit={handleSubmit(v => onSubmit(transform.out(v)))}
      >
        <TextField
          label="Work Email Address"
          value={userEmail}
          InputProps={{ readOnly: true }}
        />

        <Controller
          control={control}
          {...identifiers[FIELD_NAMES.customerName]}
          render={({ field: { ref, ...rest } }) => (
            <TextField
              {...rest}
              {...identifiers[FIELD_NAMES.customerName]}
              label="Organisation Name"
            />
          )}
        />

        <Controller
          control={control}
          {...identifiers[FIELD_NAMES.customerType]}
          render={({ field: { ref, ...rest } }) => (
            <TextField
              {...rest}
              {...identifiers[FIELD_NAMES.customerType]}
              label="Type of Organisation"
              select
            >
              {ORGANISATION_TYPES.map(({ name, value }) => (
                <MenuItem key={name} value={value}>
                  {name}
                </MenuItem>
              ))}
            </TextField>
          )}
        />

        <Controller
          {...identifiers[FIELD_NAMES.registeredNumber]}
          control={control}
          render={({ field: { ref, ...rest } }) => (
            <TextField
              {...rest}
              {...identifiers[FIELD_NAMES.registeredNumber]}
              label="Registered Number"
            />
          )}
        />

        <Controller
          {...identifiers[FIELD_NAMES.vatNumber]}
          control={control}
          render={({ field: { ref, ...rest } }) => (
            <TextField
              {...rest}
              {...identifiers[FIELD_NAMES.vatNumber]}
              label="VAT Number"
            />
          )}
        />

        <Controller
          {...identifiers[FIELD_NAMES.address]}
          control={control}
          render={({ field: { ref, ...rest } }) => (
            <TextField
              {...rest}
              {...identifiers[FIELD_NAMES.address]}
              label="Billing Address"
            />
          )}
        />

        <Button type="submit" disabled={!isDirty}>
          Save
        </Button>
      </form>
    </Wrapper>
  );
};
