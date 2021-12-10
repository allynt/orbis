import * as React from 'react';

import {
  Button,
  Link,
  PasswordStrengthMeter,
  TextField,
  Typography,
} from '@astrosat/astrosat-ui';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { object as yupObject } from 'yup';

import { LOGIN } from 'accounts/accounts.constants';
import { status } from 'accounts/accounts.slice';
import { ErrorWell } from 'accounts/error-well.component';
import { Form } from 'components';
import { FIELD_NAMES, newPassword, newPasswordConfirm } from 'utils/validators';

const PasswordResetSuccessView = () => (
  <Form>
    <Form.Row component={Typography} align="center">
      Your password has successfully been reset. Click the button to continue.
    </Form.Row>

    <Form.Row centered>
      <Button
        // @ts-ignore
        to={LOGIN}
        component={RouterLink}
      >
        Continue
      </Button>
    </Form.Row>
  </Form>
);

const validationSchema = yupObject({
  [FIELD_NAMES.newPassword]: newPassword,
  [FIELD_NAMES.newPasswordConfirm]: newPasswordConfirm,
});

const PasswordResetForm = ({
  confirmResetPassword,
  resetStatus,
  // match,
  error,
  passwordMinLength,
  passwordMaxLength,
  passwordStrength,
}) => {
  const params = useParams();
  const { register, handleSubmit, errors, watch } = useForm({
    resolver: yupResolver(validationSchema),
    context: { passwordMinLength, passwordMaxLength, passwordStrength },
  });

  if (resetStatus === status.COMPLETE) {
    return <PasswordResetSuccessView />;
  }

  const onSubmit = submission => {
    confirmResetPassword(submission, params);
    // confirmResetPassword(submission, match.params);
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <ErrorWell errors={error} />

      <Form.Row>
        <TextField
          inputRef={register}
          id={FIELD_NAMES.newPassword}
          name={FIELD_NAMES.newPassword}
          label="New Password"
          type="password"
          autoFocus
          error={!!errors[FIELD_NAMES.newPassword]}
          helperText={errors[FIELD_NAMES.newPassword]?.message}
        />

        <PasswordStrengthMeter password={watch(FIELD_NAMES.newPassword)} />
      </Form.Row>

      <Form.Row>
        <TextField
          inputRef={register}
          id={FIELD_NAMES.newPasswordConfirm}
          name={FIELD_NAMES.newPasswordConfirm}
          label="New Password Confirmation"
          type="password"
          error={!!errors[FIELD_NAMES.newPasswordConfirm]}
          helperText={errors[FIELD_NAMES.newPasswordConfirm]?.message}
        />
      </Form.Row>

      <Form.Row centered>
        <Button type="submit" disabled={Object.keys(errors).length > 0}>
          Reset Password
        </Button>
      </Form.Row>

      <Form.Row component={Typography} align="center">
        Do you have an account?&nbsp;
        <Link
          // @ts-ignore
          to={LOGIN}
          component={RouterLink}
        >
          Login
        </Link>
      </Form.Row>
    </Form>
  );
};

export default PasswordResetForm;
