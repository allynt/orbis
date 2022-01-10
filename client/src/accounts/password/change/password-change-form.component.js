import React, { useState } from 'react';

import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
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
import apiClient from 'api-client';
import { Form } from 'components';
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
      <Button to={LOGIN} component={RouterLink}>
        Continue
      </Button>
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

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
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
    <Form onSubmit={handleSubmit(onSubmit)}>
      <ErrorWell errors={error} />
      <Form.Row>
        <TextField
          type="password"
          id={FIELD_NAMES.oldPassword}
          name={FIELD_NAMES.oldPassword}
          {...register(FIELD_NAMES.oldPassword)}
          label="Old Password"
          error={!!errors[FIELD_NAMES.oldPassword]}
          helperText={errors[FIELD_NAMES.oldPassword]?.message}
          autoFocus
        />
      </Form.Row>
      <Form.Row>
        <TextField
          type="password"
          id={FIELD_NAMES.newPassword}
          name={FIELD_NAMES.newPassword}
          {...register(FIELD_NAMES.newPassword)}
          label="New Password"
          error={!!errors[FIELD_NAMES.newPassword]}
          helperText={errors[FIELD_NAMES.newPassword]?.message}
        />
        <PasswordStrengthMeter password={watch(FIELD_NAMES.newPassword)} />
      </Form.Row>
      <Form.Row>
        <TextField
          type="password"
          id={FIELD_NAMES.newPasswordConfirm}
          name={FIELD_NAMES.newPasswordConfirm}
          {...register(FIELD_NAMES.newPasswordConfirm)}
          label="New Password Confirmation"
          error={!!errors[FIELD_NAMES.newPasswordConfirm]}
          helperText={errors[FIELD_NAMES.newPasswordConfirm]?.message}
        />
      </Form.Row>
      <Form.Row>
        <FormControlLabel
          label={
            <>
              I agree with&nbsp;
              <Link
                target="_blank"
                rel="noopener noreferrer"
                href={apiClient.documents.termsUrl}
              >
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
      </Form.Row>

      <Form.Row centered>
        <Button
          type="submit"
          disabled={!termsAgreed || Object.keys(errors).length > 0}
        >
          Change Password
        </Button>
      </Form.Row>
      <Form.Row centered>
        <Typography>
          Do you have an account?&nbsp;
          <Link to={LOGIN} component={RouterLink}>
            Login
          </Link>
        </Typography>
      </Form.Row>
    </Form>
  );
};

export default PasswordChangeForm;
