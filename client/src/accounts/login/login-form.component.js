import React, { useEffect, useState } from 'react';

import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Link,
  TextField,
  Typography,
} from '@astrosat/astrosat-ui';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Link as RouterLink } from 'react-router-dom';
import * as yup from 'yup';

import { PASSWORD_RESET_REQUEST, REGISTER } from 'accounts/accounts.constants';
import { ErrorWell } from 'accounts/error-well.component';
import apiClient from 'api-client';
import { Form } from 'components';
import { email, FIELD_NAMES, password } from 'utils/validators';

const loginSchema = yup.object({
  [FIELD_NAMES.email]: email,
  [FIELD_NAMES.password]: password,
});

/**
 * @typedef {{
 *   isLoading?: boolean
 *   passwordMinLength: number
 *   passwordMaxLength: number
 *   serverErrors?: string[]
 *   user: import('typings').User
 *   activateAccount?: (data: {key: string}) => void
 *   login: (data: { email: string, password: string, accepted_terms?: boolean}) => void
 * } & Partial<import('react-router-dom').RouteComponentProps>} LoginProps
 */

/**
 * @param {LoginProps} props
 */
const LoginForm = ({
  isLoading = false,
  match,
  passwordMinLength,
  passwordMaxLength,
  serverErrors,
  user,
  activateAccount,
  login,
}) => {
  const isRegisteringCustomer = user?.registration_stage;
  const isOnboardingTeamMember = user?.accepted_terms === false;

  const [termsAgreed, setTermsAgreed] = useState(false);

  useEffect(() => {
    if (
      match?.params?.key &&
      activateAccount &&
      (!user?.is_verified || user?.is_verified === 'False')
    )
      activateAccount({ ...match.params });
  }, [activateAccount, match, user]);

  const { register, handleSubmit, formState, errors } = useForm({
    resolver: yupResolver(loginSchema),
    context: { passwordMinLength, passwordMaxLength },
  });

  const onSubmit = data => {
    const submission = isOnboardingTeamMember
      ? { ...data, accepted_terms: termsAgreed }
      : data;
    login(submission);
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} noValidate>
      <ErrorWell errors={serverErrors} />

      <Form.Row>
        <TextField
          inputRef={register}
          label={isRegisteringCustomer ? 'Work Email Address' : 'Email'}
          type="email"
          name={FIELD_NAMES.email}
          id={FIELD_NAMES.email}
          error={!!errors[FIELD_NAMES.email]}
          helperText={errors[FIELD_NAMES.email]?.message}
          autoFocus
          required
        />
      </Form.Row>

      <Form.Row>
        <TextField
          inputRef={register}
          label="Password"
          id={FIELD_NAMES.password}
          name={FIELD_NAMES.password}
          error={!!errors[FIELD_NAMES.password]}
          helperText={errors[FIELD_NAMES.password]?.message}
          type="password"
          required
        />
      </Form.Row>

      <Form.Row component={Box} display="flex">
        {isOnboardingTeamMember && (
          <>
            <FormControlLabel
              label={
                <>
                  I agree with&nbsp;
                  <Link
                    target="_blank"
                    href={apiClient.documents.termsUrl}
                    rel="noopener noreferrer"
                  >
                    Terms &amp; Conditions
                  </Link>
                </>
              }
              control={
                <Checkbox
                  name="loggedIn"
                  onChange={() => setTermsAgreed(c => !c)}
                />
              }
            />
          </>
        )}

        <Box ml="auto">
          <Link
            // @ts-ignore
            to={PASSWORD_RESET_REQUEST}
            component={RouterLink}
          >
            Forgot password?
          </Link>
        </Box>
      </Form.Row>

      <Form.Row centered>
        <Button
          type="submit"
          disabled={
            Object.keys(errors).length > 0 ||
            !formState.isDirty ||
            (isOnboardingTeamMember && !termsAgreed)
          }
        >
          {isLoading ? <CircularProgress size={22} color="inherit" /> : 'Login'}
        </Button>
      </Form.Row>

      <Form.Row centered>
        {!isRegisteringCustomer && (
          <Typography>
            Don't have an account?&nbsp;
            <Link
              // @ts-ignore
              component={RouterLink}
              to={REGISTER}
            >
              Sign Up
            </Link>
          </Typography>
        )}
      </Form.Row>
    </Form>
  );
};

export default LoginForm;
