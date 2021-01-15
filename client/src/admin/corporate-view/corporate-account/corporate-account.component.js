import {
  Avatar,
  Button,
  FormControl,
  FormLabel,
  Grid,
  styled,
  Typography,
} from '@astrosat/astrosat-ui';
import { yupResolver } from '@hookform/resolvers/yup';
import { Form, InlineTextField } from 'components';
import OrbisAdminIcon from '../../orbis-admin-icon.svg';
import React from 'react';
import { useForm } from 'react-hook-form';
import { customerName, FIELD_NAMES } from 'utils/validators';
import * as yup from 'yup';

const BigAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.typography.pxToRem(78),
  height: theme.typography.pxToRem(78),
  boxShadow: theme.shadows[3],
}));

const corporateAccountSchema = yup.object({
  [FIELD_NAMES.customerName]: customerName,
});

/**
 * @param {{
 *   customer?: import('typings/orbis').Customer
 *   updateCustomer?: (customer: import('typings/orbis').Customer) => void
 * }} props
 */
const CorporateAccount = ({ customer, updateCustomer }) => {
  const onSubmit = values => {
    const data = {
      name: values.customerName,
      country: values.country,
      address: values.address,
      postcode: values.postcode,
    };
    const newCustomer = { ...customer, ...data };
    updateCustomer(newCustomer);
  };

  const { register, handleSubmit, errors, formState } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(corporateAccountSchema),
    defaultValues: { ...customer, customerName: customer?.name },
  });

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Form.Row>
        <BigAvatar
          src={customer?.logo ? customer.logo : OrbisAdminIcon}
          alt={customer?.name ? `${customer?.name} Logo` : 'Orbis Logo'}
          variant="rounded"
        />
      </Form.Row>
      <Grid item xs={3}>
        <InlineTextField
          label="Name:"
          id={FIELD_NAMES.customerName}
          name={FIELD_NAMES.customerName}
          placeholder="Add Name"
          inputRef={register}
          error={!!errors[FIELD_NAMES.customerName]}
          helperText={errors[FIELD_NAMES.customerName]?.message}
        />
      </Grid>
      <Grid item xs={9} />
      <Form.Row>
        <FormControl component="fieldset">
          <FormLabel component="legend">
            <Typography variant="h2">Full Address</Typography>
          </FormLabel>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <InlineTextField
                label="Country:"
                id={FIELD_NAMES.country}
                name={FIELD_NAMES.country}
                placeholder="Add Country"
                inputRef={register}
                error={!!errors[FIELD_NAMES.country]}
                helperText={errors[FIELD_NAMES.country]?.message}
              />
            </Grid>
            <Grid item xs={6}>
              <InlineTextField
                label="Street &amp; House Number:"
                id={FIELD_NAMES.address}
                name={FIELD_NAMES.address}
                placeholder="Add Address"
                inputRef={register}
                error={!!errors[FIELD_NAMES.address]}
                helperText={errors[FIELD_NAMES.address]?.message}
              />
            </Grid>
            <Grid item xs={3}>
              <InlineTextField
                label="Postcode:"
                id={FIELD_NAMES.postcode}
                name={FIELD_NAMES.postcode}
                placeholder="Add Postcode"
                inputRef={register}
                error={!!errors[FIELD_NAMES.postcode]}
                helperText={errors[FIELD_NAMES.postcode]?.message}
              />
            </Grid>
          </Grid>
        </FormControl>
      </Form.Row>
      <Form.Row>
        <Button
          type="submit"
          size="small"
          disabled={Object.keys(errors).length > 0 || !formState.isDirty}
        >
          Update Changes
        </Button>
      </Form.Row>
    </Form>
  );
};

export default CorporateAccount;
