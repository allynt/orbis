import { Button, Checkbox, Textfield } from '@astrosat/astrosat-ui';
import { LOGIN_URL, TERMS_URL } from 'accounts/accounts.constants';
import { ErrorWell } from 'accounts/error-well.component';
import { LoadingSpinner } from 'components/loading-spinner/loading-spinner.component';
import React from 'react';
import { Link } from 'react-router-dom';
import { FIELD_NAMES } from 'utils/validators';

const UserRegistration = ({ serverErrors, isLoading }) => (
  <form>
    <ErrorWell errors={serverErrors} />
    <label htmlFor={FIELD_NAMES.email}>
      Work Email Address*
      <Textfield id={FIELD_NAMES.email} />
    </label>
    <label htmlFor={FIELD_NAMES.firstName}>
      First Name*
      <Textfield id={FIELD_NAMES.firstName} />
    </label>
    <label htmlFor={FIELD_NAMES.lastName}>
      Last Name*
      <Textfield id={FIELD_NAMES.lastName} />
    </label>
    <label htmlFor={FIELD_NAMES.newPassword}>
      Password*
      <Textfield id={FIELD_NAMES.newPassword} />
    </label>
    <label htmlFor={FIELD_NAMES.newPasswordConfirm}>
      Password Confirmation*
      <Textfield id={FIELD_NAMES.newPasswordConfirm} />
    </label>
    <Checkbox
      label={
        <>
          I agree with{' '}
          <Button href={TERMS_URL} rel="noreferrer noopener" target="_blank">
            Terms &amp; Conditions
          </Button>
        </>
      }
    />
    <Button>{isLoading ? <LoadingSpinner /> : 'Sign Up'}</Button>
    <p>
      Do you have an account?{' '}
      <Link to={LOGIN_URL}>
        <Button theme="link">Login</Button>
      </Link>
    </p>
  </form>
);

export default UserRegistration;
