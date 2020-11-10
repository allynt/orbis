import * as React from 'react';

import {
  Button,
  Grid,
  Link,
  PasswordStrengthMeter,
  TextField,
  Typography,
} from '@astrosat/astrosat-ui';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Link as RouterLink } from 'react-router-dom';
import { object as yupObject } from 'yup';

import { LOGIN } from 'accounts/accounts.constants';
import { status } from 'accounts/accounts.slice';
import { ErrorWell } from 'accounts/error-well.component';
import { FIELD_NAMES, newPassword, newPasswordConfirm } from 'utils/validators';

const PasswordResetSuccessView = () => (
  <Grid container spacing={2}>
    <Grid item xs={12} component={Typography} container justify="center">
      Your password has successfully been reset. Click the button to continue.
    </Grid>

    <Grid item xs={12} container justify="center">
      <RouterLink to={LOGIN} component={Button}>
        Continue
      </RouterLink>
    </Grid>
  </Grid>
);

const validationSchema = yupObject({
  [FIELD_NAMES.newPassword]: newPassword,
  [FIELD_NAMES.newPasswordConfirm]: newPasswordConfirm,
});

const PasswordResetForm = ({
  confirmResetPassword,
  resetStatus,
  match,
  error,
  passwordMinLength,
  passwordMaxLength,
  passwordStrength,
}) => {
  const { register, handleSubmit, errors, watch } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(validationSchema),
    context: { passwordMinLength, passwordMaxLength, passwordStrength },
  });

  if (resetStatus === status.COMPLETE) {
    return <PasswordResetSuccessView />;
  }

  const onSubmit = submission => {
    confirmResetPassword(submission, match.params);
  };

  return (
    <Grid
      component="form"
      container
      spacing={2}
      onSubmit={handleSubmit(onSubmit)}
    >
      <ErrorWell errors={error} />

      <Grid item xs={12}>
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
      </Grid>

      <Grid item xs={12}>
        <TextField
          inputRef={register}
          id={FIELD_NAMES.newPasswordConfirm}
          name={FIELD_NAMES.newPasswordConfirm}
          label="New Password Confirmation"
          type="password"
          autoFocus
          error={!!errors[FIELD_NAMES.newPasswordConfirm]}
          helperText={errors[FIELD_NAMES.newPasswordConfirm]?.message}
        />
      </Grid>

      <Grid item xs={12} container justify="center">
        <Button type="submit" disabled={Object.keys(errors).length > 0}>
          Reset Password
        </Button>
      </Grid>

      <Grid component={Typography} item xs={12} container justify="center">
        Do you have an account?&nbsp;
        <RouterLink to={LOGIN} component={Link}>
          Login
        </RouterLink>
      </Grid>
    </Grid>
  );
};

export default PasswordResetForm;
