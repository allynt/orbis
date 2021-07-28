import React from 'react';

import {
  Button,
  TextField,
  Typography,
  makeStyles,
  Grid,
} from '@astrosat/astrosat-ui';

import { useForm } from 'react-hook-form';

const EMAIL_FIELD_ID = 'email-field';
const NAME_FIELD_ID = 'name-field';

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
  const { handleSubmit, register } = useForm({
    defaultValues: { ...user },
  });

  const onSubmit = values => {
    updateUser(values);
  };

  return (
    <Grid
      className={styles.form}
      container
      spacing={2}
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      justify="space-between"
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
            id={EMAIL_FIELD_ID}
            name="email"
            inputRef={register}
            label="Email"
            InputProps={{ readOnly: true }}
          />
        </Grid>
        <Grid item>
          <TextField
            id={NAME_FIELD_ID}
            name="name"
            inputRef={register}
            label="Name"
          />
        </Grid>
      </Grid>
      <Grid item>
        <Button fullWidth type="submit">
          Update Account
        </Button>
      </Grid>
    </Grid>
  );
};

export default UpdateUserForm;
