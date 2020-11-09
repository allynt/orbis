import React, { useState } from 'react';

import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Link,
  PasswordStrengthMeter,
  TextField,
  Typography,
} from '@astrosat/astrosat-ui';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Link as RouterLink } from 'react-router-dom';
import { object } from 'yup';

import { LOGIN } from 'accounts/accounts.constants';
import { status } from 'accounts/accounts.slice';
import { ErrorWell } from 'accounts/error-well.component';
import { TERMS } from 'legal-documents/legal-documents-constants';
import {
  FIELD_NAMES,
  newPassword,
  newPasswordConfirm,
  oldPassword,
} from 'utils/validators';

const ChangePasswordSuccessView = () => (
  <>
    <Typography>Thank you! Your password has been changed.</Typography>
    <Typography>
      You have completed your ORBIS account. Click the button in order to
      continue.
    </Typography>

    <Box mt={2} width="100%" display="flex" justifyContent="center">
      <RouterLink to={LOGIN} component={Button}>
        Continue
      </RouterLink>
    </Box>
  </>
);

const validationSchema = object({
  oldPassword,
  newPassword,
  newPasswordConfirm,
});

const PasswordChangeForm = ({
  changePassword,
  changeStatus,
  error,
  passwordMinLength,
  passwordMaxLength,
  passwordStrength,
}) => {
  const [termsAgreed, setTermsAgreed] = useState(false);

  const { register, handleSubmit, errors, watch } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(validationSchema),
    context: { passwordMinLength, passwordMaxLength, passwordStrength },
  });

  if (changeStatus === status.PENDING) return <ChangePasswordSuccessView />;

  const onSubmit = data => {
    changePassword({
      ...data,
      accepted_terms: termsAgreed,
    });
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
          type="password"
          id={FIELD_NAMES.oldPassword}
          name={FIELD_NAMES.oldPassword}
          inputRef={register}
          label="Old Password"
          error={!!errors[FIELD_NAMES.oldPassword]}
          helperText={errors[FIELD_NAMES.oldPassword]?.message}
          autoFocus
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          type="password"
          id={FIELD_NAMES.newPassword}
          name={FIELD_NAMES.newPassword}
          inputRef={register}
          label="New Password"
          error={!!errors[FIELD_NAMES.newPassword]}
          helperText={errors[FIELD_NAMES.newPassword]?.message}
        />
        <PasswordStrengthMeter password={watch(FIELD_NAMES.newPassword)} />
      </Grid>
      <Grid item xs={12}>
        <TextField
          type="password"
          id={FIELD_NAMES.newPasswordConfirm}
          name={FIELD_NAMES.newPasswordConfirm}
          inputRef={register}
          label="New Password Confirmation"
          error={!!errors[FIELD_NAMES.newPasswordConfirm]}
          helperText={errors[FIELD_NAMES.newPasswordConfirm]?.message}
        />
      </Grid>
      <Grid item xs={12}>
        <FormControlLabel
          label={
            <>
              I agree with&nbsp;
              <Link target="_blank" rel="noopener noreferrer" href={TERMS}>
                Terms &amp; Conditions
              </Link>
            </>
          }
          control={
            <Checkbox
              name="loggedIn"
              onChange={() => setTermsAgreed(!termsAgreed)}
            />
          }
        />
      </Grid>

      <Grid item xs={12} container justify="center">
        <Button
          type="submit"
          disabled={!termsAgreed || Object.keys(errors).length > 0}
        >
          Change Password
        </Button>
      </Grid>
      <Grid item xs={12} container justify="center">
        <Typography>
          Do you have an account?&nbsp;
          <RouterLink to={LOGIN} component={Link}>
            Login
          </RouterLink>
        </Typography>
      </Grid>
    </Grid>
  );
};

export default PasswordChangeForm;
