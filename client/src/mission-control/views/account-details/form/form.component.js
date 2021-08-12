import React from 'react';

import { Button, makeStyles, MenuItem, TextField } from '@astrosat/astrosat-ui';

import { Controller, useForm } from 'react-hook-form';

import ContentWrapper from 'mission-control/content-wrapper.component';
import { FIELD_NAMES } from 'utils/validators';

const useStyles = makeStyles(theme => ({
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
  [FIELD_NAMES.customerNameOfficial, 'official_name'],
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
    let result = {};
    mapping.forEach((value, key) => (result[key] = customer[value]));
    return result;
  },
  /**
   * @param {Record<string, any>} values
   * @returns {Partial<import('typings').Customer>}
   */
  out: values => {
    let result = {};
    mapping.forEach((value, key) => (result[value] = values[key]));
    return result;
  },
};

/**
 * @param {{
 *  onSubmit?: (values: Pick<import('typings').Customer,
 *    'address' |
 *    'company_type' |
 *    'official_name' |
 *    'type' |
 *    'vat_number'>) => void
 *  customer?: Partial<import('typings').Customer>
 * }} props
 */
export const Form = ({ onSubmit, customer = {} }) => {
  const styles = useStyles();
  const { register, handleSubmit, control, formState } = useForm({
    defaultValues: transform.in(customer),
  });

  return (
    <ContentWrapper title="Account Details">
      <form
        className={styles.form}
        onSubmit={handleSubmit(v => onSubmit?.(transform.out(v)))}
      >
        <TextField
          {...identifiers[FIELD_NAMES.customerNameOfficial]}
          label="Organisation Name"
          inputRef={register}
        />
        <Controller
          {...identifiers[FIELD_NAMES.customerType]}
          control={control}
          as={
            <TextField label="Type of Organisation" select>
              <MenuItem value="CHARITY">Charity</MenuItem>
            </TextField>
          }
        />
        <TextField
          {...identifiers[FIELD_NAMES.registeredNumber]}
          label="Registered Number"
          inputRef={register}
        />
        <TextField
          {...identifiers[FIELD_NAMES.vatNumber]}
          label="VAT Number"
          inputRef={register}
        />
        <TextField
          {...identifiers[FIELD_NAMES.address]}
          label="Billing Address"
          inputRef={register}
        />
        <Button type="submit" disabled={!formState.isDirty}>
          Save
        </Button>
      </form>
    </ContentWrapper>
  );
};
