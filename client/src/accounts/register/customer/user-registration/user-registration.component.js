import React from 'react';

import {
  Button,
  Checkbox,
  FormControlLabel,
  PasswordStrengthMeter,
  TextField,
  Link,
  Typography,
  CircularProgress,
} from '@astrosat/astrosat-ui';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Link as RouterLink } from 'react-router-dom';
import { object as yupObject } from 'yup';

import { LOGIN } from 'accounts/accounts.constants';
import { ErrorWell } from 'accounts/error-well.component';
import { Form } from 'components';
import { TERMS } from 'legal-documents/legal-documents-constants';
import {
  acceptedTerms,
  email,
  FIELD_NAMES,
  firstName,
  lastName,
  newPassword,
  newPasswordConfirm,
} from 'utils/validators';

/**
 * @typedef {{
 *  email: string
 *  name: string
 *  newPassword: string
 *  newPasswordConfirm: string
 *  acceptedTerms: boolean
 *  registration_stage: User['registration_stage']
 * }} FormValues
 */

const validationSchema = yupObject({
  [FIELD_NAMES.email]: email,
  [FIELD_NAMES.firstName]: firstName,
  [FIELD_NAMES.lastName]: lastName,
  [FIELD_NAMES.newPassword]: newPassword,
  [FIELD_NAMES.newPasswordConfirm]: newPasswordConfirm,
  [FIELD_NAMES.acceptedTerms]: acceptedTerms,
});

/**
 * @param {{
 *   serverErrors?: string[]
 *   isLoading?: boolean
 *   onSubmit?:(values: FormValues) => void
 *   passwordMinLength?: number,
 *   passwordMaxLength?: number,
 *   passwordStrength?: number
 * }} props
 */
const UserRegistration = ({
  serverErrors,
  isLoading = false,
  onSubmit,
  passwordMinLength = 0,
  passwordMaxLength = 255,
  passwordStrength = 0,
}) => {
  const { errors, handleSubmit, register, watch } = useForm({
    defaultValues: {
      email: undefined,
      firstName: undefined,
      lastName: undefined,
      newPassword: undefined,
      newPasswordConfirm: undefined,
      acceptedTerms: false,
    },
    resolver: yupResolver(validationSchema),
    context: { passwordMinLength, passwordMaxLength, passwordStrength },
  });

  return (
    <Form
      noValidate
      onSubmit={handleSubmit(
        ({ firstName, lastName, ...rest }) =>
          onSubmit &&
          onSubmit({
            ...rest,
            name: `${firstName} ${lastName}`,
            registration_stage: 'CUSTOMER',
          }),
      )}
    >
      <ErrorWell errors={serverErrors} />
      <Form.Row>
        <TextField
          id={FIELD_NAMES.email}
          name={FIELD_NAMES.email}
          label="Work Email Address"
          inputRef={register}
          error={!!errors[FIELD_NAMES.email]}
          helperText={errors[FIELD_NAMES.email]?.message}
          required
        />
      </Form.Row>
      <Form.Row>
        <TextField
          id={FIELD_NAMES.firstName}
          name={FIELD_NAMES.firstName}
          label="First Name"
          inputRef={register}
          error={!!errors[FIELD_NAMES.firstName]}
          helperText={errors[FIELD_NAMES.firstName]?.message}
          required
        />
      </Form.Row>
      <Form.Row>
        <TextField
          id={FIELD_NAMES.lastName}
          name={FIELD_NAMES.lastName}
          label="Last Name"
          inputRef={register}
          error={!!errors[FIELD_NAMES.lastName]}
          helperText={errors[FIELD_NAMES.lastName]?.message}
          required
        />
      </Form.Row>
      <Form.Row>
        <TextField
          id={FIELD_NAMES.newPassword}
          name={FIELD_NAMES.newPassword}
          label="Password"
          inputRef={register}
          error={!!errors[FIELD_NAMES.newPassword]}
          helperText={errors[FIELD_NAMES.newPassword]?.message}
          type="password"
          required
        />
        <PasswordStrengthMeter password={watch(FIELD_NAMES.newPassword)} />
      </Form.Row>
      <Form.Row>
        <TextField
          id={FIELD_NAMES.newPasswordConfirm}
          name={FIELD_NAMES.newPasswordConfirm}
          label="Password Confirmation"
          inputRef={register}
          error={!!errors[FIELD_NAMES.newPasswordConfirm]}
          helperText={errors[FIELD_NAMES.newPasswordConfirm]?.message}
          type="password"
          required
        />
      </Form.Row>
      <Form.Row>
        <FormControlLabel
          label={
            <Typography>
              I agree with&nbsp;
              <Link href={TERMS} rel="noreferrer noopener" target="_blank">
                Terms &amp; Conditions
              </Link>
            </Typography>
          }
          control={<Checkbox name={FIELD_NAMES.acceptedTerms} ref={register} />}
        />
      </Form.Row>

      <Form.Row centered>
        <Button type="submit" disabled={!watch(FIELD_NAMES.acceptedTerms)}>
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

export default UserRegistration;
