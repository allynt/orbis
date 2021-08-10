import React, { useEffect } from 'react';

import {
  Button,
  TextField,
  Typography,
  makeStyles,
  Grid,
} from '@astrosat/astrosat-ui';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { email, FIELD_NAMES, name } from 'utils/validators';

const updateUserFormSchema = yup.object({
  [FIELD_NAMES.email]: email,
  [FIELD_NAMES.name]: name,
});
const useStyles = makeStyles({
  form: {
    height: '100%',
  },
});

/**
 *
 * @param {{
 *  user?: import('typings').User
 *  updateUser?: (values: {
 *    email: string
 *    name: string
 * }) => void
 * }} props
 */
const UpdateUserForm = ({ user, updateUser }) => {
  const styles = useStyles();
  const {
    getValues,
    handleSubmit,
    register,
    formState,
    reset,
    errors,
  } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(updateUserFormSchema),
    defaultValues: { ...user },
  });

  const onSubmit = values => {
    updateUser(values);
  };

  useEffect(() => {
    if (formState.isSubmitSuccessful) {
      reset(getValues());
    }
  }, [formState, getValues, reset]);

  return (
    <Grid
      className={styles.form}
      container
      spacing={2}
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      justifyContent="space-between"
      direction="column"
    >
      <Grid item container direction="column" spacing={2}>
        <Grid item>
          <Typography variant="h4" component="h1">
            Personal Details
          </Typography>
        </Grid>
        <Grid item>
          <TextField
            id={FIELD_NAMES.email}
            name={FIELD_NAMES.email}
            inputRef={register}
            label="Email"
            InputProps={{ readOnly: true }}
          />
        </Grid>
        <Grid item>
          <TextField
            id={FIELD_NAMES.name}
            name={FIELD_NAMES.name}
            inputRef={register}
            error={!!errors[FIELD_NAMES.name]}
            helperText={errors[FIELD_NAMES.name]?.message}
            label="Name"
          />
        </Grid>
      </Grid>
      <Grid item>
        <Button
          fullWidth
          type="submit"
          disabled={!!Object.keys(errors).length || !formState.isDirty}
        >
          Update Account
        </Button>
      </Grid>
    </Grid>
  );
};

export default UpdateUserForm;
