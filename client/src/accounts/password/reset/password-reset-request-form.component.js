import React from 'react';

import {
  Button,
  TextField,
  Typography,
  Link,
  Box,
} from '@astrosat/astrosat-ui';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Link as RouterLink } from 'react-router-dom';
import { object } from 'yup';

import { ErrorWell } from 'accounts/error-well.component';
import { LOGIN } from '../../accounts.constants';
import { status } from '../../accounts.slice';
import { Form } from 'components';
import { FIELD_NAMES, email } from 'utils/validators';

const PasswordResetRequestSuccessView = ({ email, onSubmit }) => (
  <>
    <Typography variant="h3" component="h1" gutterBottom>
      Check your email
    </Typography>

    <Typography paragraph>
      If <b>{email}</b> is associated with an Astrosat ID, you should receive an
      email containing instructions on how to create a new password.
    </Typography>

    <Typography variant="h3" component="h1" gutterBottom>
      You haven't received the email?
    </Typography>
    <Typography paragraph>Please check your spam or bulk folders.</Typography>

    <Box display="flex" flexDirection="column" alignItems="center">
      <Box mb={2}>
        <Button onClick={() => onSubmit(email)}>Resend email</Button>
      </Box>
      <RouterLink to={LOGIN} component={Link}>
        Return to login
      </RouterLink>
    </Box>
  </>
);

const validationSchema = object({
  [FIELD_NAMES.email]: email,
});

const PasswordResetRequestForm = ({ resetPassword, resetStatus, error }) => {
  const { register, handleSubmit, getValues, formState, errors } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = data => {
    resetPassword(data);
  };

  if (resetStatus === status.PENDING)
    return (
      <PasswordResetRequestSuccessView
        email={getValues().email}
        onSubmit={onSubmit}
      />
    );

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <ErrorWell errors={error} />

      <Form.Row>
        <TextField
          id={FIELD_NAMES.email}
          name={FIELD_NAMES.email}
          inputRef={register}
          label="Email"
          autoFocus
          error={!!errors[FIELD_NAMES.email]}
          helperText={errors[FIELD_NAMES.email]?.message}
        />
      </Form.Row>

      <Form.Row centered>
        <Button
          type="submit"
          disabled={Object.keys(errors).length > 0 || !formState.isDirty}
        >
          Reset Password
        </Button>
      </Form.Row>

      <Form.Row component={Typography} align="center">
        Do you have an account?&nbsp;
        <RouterLink to={LOGIN} component={Link}>
          Login
        </RouterLink>
      </Form.Row>
    </Form>
  );
};

export default PasswordResetRequestForm;
