import React, { useState, useEffect } from 'react';

import {
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Link,
  Typography,
  CircularProgress,
  Grid,
  Box,
} from '@astrosat/astrosat-ui';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Link as RouterLink } from 'react-router-dom';
import * as yup from 'yup';

import { TERMS } from 'legal-documents/legal-documents-constants';
import { PASSWORD_RESET_REQUEST, REGISTER } from 'accounts/accounts.constants';
import { ErrorWell } from 'accounts/error-well.component';
import { FIELD_NAMES, email, password } from 'utils/validators';

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
 *   user: User
 *   activateAccount?: (data: {key: string}) => void
 *   login: (data: { email: string, password: string}) => void
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
    mode: 'onBlur',
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
    <Grid
      component="form"
      container
      spacing={2}
      onSubmit={handleSubmit(onSubmit)}
    >
      <ErrorWell errors={serverErrors} />

      <Grid item xs={12}>
        <TextField
          inputRef={register}
          label={isRegisteringCustomer ? 'Work Email Address' : 'Email'}
          name={FIELD_NAMES.email}
          error={!!errors[FIELD_NAMES.email]}
          helperText={errors[FIELD_NAMES.email]?.message}
          autoFocus
          required
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          inputRef={register}
          label="Password"
          name={FIELD_NAMES.password}
          error={!!errors[FIELD_NAMES.password]}
          helperText={errors[FIELD_NAMES.password]?.message}
          type="password"
          required
        />
      </Grid>

      <Grid item xs={12} component={Box} display="flex">
        {!isRegisteringCustomer && (
          <FormControlLabel
            label="Keep me logged in"
            control={
              <Checkbox
                name="loggedIn"
                onChange={() => console.log('Keep me logged in')}
              />
            }
          />
        )}

        <Box ml="auto">
          <RouterLink to={PASSWORD_RESET_REQUEST} component={Link}>
            Forgot password?
          </RouterLink>
        </Box>
      </Grid>

      <Grid item xs={12} container justify="center">
        <Button
          type="submit"
          disabled={Object.keys(errors).length > 0 || !formState.isDirty}
        >
          {isLoading ? <CircularProgress size={22} color="inherit" /> : 'Login'}
        </Button>
      </Grid>

      <Grid item xs={12} container justify="center">
        {!isRegisteringCustomer && (
          <Typography>
            Don't have an account?&nbsp;
            <RouterLink to={REGISTER} component={Link}>
              Sign Up
            </RouterLink>
          </Typography>
        )}
      </Grid>
    </Grid>
  );
};

export default LoginForm;
