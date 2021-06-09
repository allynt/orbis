import * as React from 'react';

import { Avatar, Button, Grid, styled } from '@astrosat/astrosat-ui';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { Form, InlineTextField } from 'components';
import { email, FIELD_NAMES } from 'utils/validators';

const AdministratorProfileSchema = yup.object({
  [FIELD_NAMES.email]: email,
});

const BigAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.typography.pxToRem(78),
  height: theme.typography.pxToRem(78),
}));

/**
 * @param {{
 *   user?: import('typings/orbis').User
 *   updateAdministrator?: (user: import('typings/orbis').User) => void
 * }} props
 */
const AdministratorProfile = ({ user, updateAdministrator }) => {
  const onSubmit = values => {
    updateAdministrator({ ...user, ...values });
  };

  const { register, handleSubmit, errors, formState } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(AdministratorProfileSchema),
    defaultValues: user,
  });

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Grid item xs={12}>
        <BigAvatar alt="Admin Avatar" src={user?.avatar} variant="rounded" />
      </Grid>
      <Grid item xs={4}>
        <InlineTextField
          id={FIELD_NAMES.name}
          name={FIELD_NAMES.name}
          label="Name:"
          placeholder="Add Name"
          inputRef={register}
          error={!!errors?.[FIELD_NAMES.name]}
          helperText={errors?.[FIELD_NAMES.name]?.message}
        />
      </Grid>
      <Grid item xs={4}>
        <InlineTextField
          id={FIELD_NAMES.email}
          name={FIELD_NAMES.email}
          label="Email:"
          placeholder="Add Email"
          inputRef={register}
          error={!!errors?.[FIELD_NAMES.email]}
          helperText={errors?.[FIELD_NAMES.email]?.message}
        />
      </Grid>
      <Grid item xs={4}>
        <InlineTextField
          id={FIELD_NAMES.phone}
          name={FIELD_NAMES.phone}
          label="Phone:"
          placeholder="Add Phone Number"
          inputRef={register}
          error={!!errors?.[FIELD_NAMES.phone]}
          helperText={errors?.[FIELD_NAMES.phone]?.message}
        />
      </Grid>
      <Grid item xs={12}>
        <Button
          type="submit"
          size="small"
          disabled={Object.keys(errors).length > 0 || !formState.isDirty}
        >
          Update Changes
        </Button>
      </Grid>
    </Form>
  );
};

export default AdministratorProfile;
