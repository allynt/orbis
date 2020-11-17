import React, { useState } from 'react';

import {
  Button,
  PasswordStrengthMeter,
  Checkbox,
  TextField,
  FormControlLabel,
  Link,
  CircularProgress,
  Typography,
} from '@astrosat/astrosat-ui';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Link as RouterLink } from 'react-router-dom';
import { object as objectSchema } from 'yup';

import { LOGIN } from 'accounts/accounts.constants';
import { ErrorWell } from 'accounts/error-well.component';
import { Form } from 'components';
import { TERMS } from 'legal-documents/legal-documents-constants';
import {
  FIELD_NAMES,
  email,
  newPassword,
  newPasswordConfirm,
} from 'utils/validators';

const validationSchema = objectSchema({
  [FIELD_NAMES.email]: email,
  [FIELD_NAMES.newPassword]: newPassword,
  [FIELD_NAMES.newPasswordConfirm]: newPasswordConfirm,
});

/**
 * @typedef FormData
 * @property {string} email
 * @property {string} newPassword
 * @property {string} newPasswordConfirm
 * @property {boolean} accepted_terms
 */

/**
 * @param {{
 *   registerUser: (form: FormData) => void
 *   serverErrors?: string[]
 *   isRegistrationOpen?: boolean
 *   passwordMinLength: number
 *   passwordMaxLength: number
 *   passwordStrength: number
 *   isLoading?: boolean
 * }} props
 */
const RegisterForm = ({
  registerUser,
  serverErrors,
  isRegistrationOpen = true,
  passwordMinLength,
  passwordMaxLength,
  passwordStrength,
  isLoading = false,
}) => {
  const { register, handleSubmit, errors, watch } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(validationSchema),
    context: { passwordMinLength, passwordMaxLength, passwordStrength },
  });

  const [termsAgreed, setTermsAgreed] = useState(false);

  const onSubmit = data => {
    registerUser({ ...data, accepted_terms: termsAgreed });
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <ErrorWell errors={serverErrors}>
        {!isRegistrationOpen && (
          <li>We are sorry, but the signup is currently closed.</li>
        )}
      </ErrorWell>
      <Form.Row>
        <TextField
          id={FIELD_NAMES.email}
          name={FIELD_NAMES.email}
          label="Email"
          inputRef={register}
          error={!!errors[FIELD_NAMES.email]}
          helperText={errors[FIELD_NAMES.email]?.message}
          autoFocus
        />
      </Form.Row>
      <Form.Row>
        <TextField
          id={FIELD_NAMES.newPassword}
          name={FIELD_NAMES.newPassword}
          inputRef={register}
          label="Password"
          type="password"
          error={!!errors[FIELD_NAMES.newPassword]}
          helperText={errors[FIELD_NAMES.newPassword]?.message}
        />
        <PasswordStrengthMeter password={watch(FIELD_NAMES.newPassword)} />
      </Form.Row>
      <Form.Row>
        <TextField
          id={FIELD_NAMES.newPasswordConfirm}
          name={FIELD_NAMES.newPasswordConfirm}
          inputRef={register}
          label="Password Confirmation"
          type="password"
          error={!!errors[FIELD_NAMES.newPasswordConfirm]}
          helperText={errors[FIELD_NAMES.newPasswordConfirm]?.message}
        />
      </Form.Row>
      <Form.Row>
        <FormControlLabel
          label={
            <>
              I agree with{' '}
              <Link target="_blank" href={TERMS} rel="noopener noreferrer">
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
          disabled={
            !termsAgreed ||
            !isRegistrationOpen ||
            Object.keys(errors).length > 0
          }
        >
          {isLoading ? (
            <CircularProgress color="inherit" size={24} />
          ) : (
            'Sign Up'
          )}
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

export default RegisterForm;
