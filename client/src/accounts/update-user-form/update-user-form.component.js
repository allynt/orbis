import React from 'react';

import {
  Button,
  TextField,
  Typography,
  makeStyles,
  Box,
} from '@astrosat/astrosat-ui';

import { useForm } from 'react-hook-form';

import { Form } from 'components';

const EMAIL_FIELD_ID = 'email-field';
const NAME_FIELD_ID = 'name-field';

const useStyles = makeStyles(theme => ({
  form: {
    marginBottom: theme.spacing(2),
  },
}));

/**
 *
 * @param {{
 *  user?: User
 *  updateUser?: (values: {
 *    email: string
 *    name: string
 * }) => void
 * }} props
 */
const UpdateUserForm = ({ user, updateUser }) => {
  const styles = useStyles();
  const { handleSubmit, register } = useForm({
    defaultValues: { email: user?.email, name: user?.name },
  });

  const onSubmit = values => {
    updateUser(values);
  };

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <Form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <Typography variant="h4" component="h1">
          Personal Details
        </Typography>
        <Form.Row>
          <TextField
            id={EMAIL_FIELD_ID}
            name="email"
            inputRef={register}
            label="Email"
            InputProps={{ readOnly: true }}
          />
        </Form.Row>
        <Form.Row>
          <TextField
            id={NAME_FIELD_ID}
            name="name"
            inputRef={register}
            label="Name"
          />
        </Form.Row>
      </Form>
      <Box mt="auto" mx="auto" width="100%">
        <Button fullWidth type="submit">
          Update Account
        </Button>
      </Box>
    </Box>
  );
};

export default UpdateUserForm;
