import React from 'react';

import { Button, MenuItem, TextField } from '@astrosat/astrosat-ui';

import { Controller, useForm } from 'react-hook-form';

const transform = {
  /** @param {Partial<import('typings').Customer>} customer */
  in: customer => ({
    organisationName: customer.official_name ?? '',
    organisationType: customer.company_type ?? '',
    registeredNumber: customer.registered_id ?? '',
    vatNumber: '',
    billingAddress: customer.address ?? '',
  }),
  out: values => ({
    official_name: values.organisationName,
    company_type: values.organisationType,
    registered_id: values.registeredNumber,
    vat_number: values.vatNumber,
    address: values.billingAddress,
  }),
};

/**
 * @param {{
 *  onSubmit?: (values: Pick<import('typings').Customer,
 *    'address' |
 *    'company_type' |
 *    'official_name' |
 *    'type'> & {vat_number: string}) => void
 *  customer?: Partial<import('typings').Customer>
 * }} props
 */
export const Form = ({ onSubmit, customer = {} }) => {
  const { register, handleSubmit, control, formState } = useForm({
    defaultValues: transform.in(customer),
  });

  return (
    <form onSubmit={handleSubmit(v => onSubmit?.(transform.out(v)))}>
      <TextField
        id="organisationName"
        name="organisationName"
        label="Organisation Name"
        inputRef={register}
      />
      <Controller
        name="organisationType"
        control={control}
        as={
          <TextField id="organisationType" label="Type of Organisation" select>
            <MenuItem value="CHARITY">Charity</MenuItem>
          </TextField>
        }
      />
      <TextField
        id="registeredNumber"
        name="registeredNumber"
        label="Registered Number"
        inputRef={register}
      />
      <TextField
        id="vatNumber"
        name="vatNumber"
        label="VAT Number"
        inputRef={register}
      />
      <TextField
        id="billingAddress"
        name="billingAddress"
        label="Billing Address"
        inputRef={register}
      />
      <Button type="submit" disabled={!formState.isDirty}>
        Save
      </Button>
    </form>
  );
};
