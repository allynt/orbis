import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Redirect } from 'react-router-dom';

import { LOGIN_URL } from './accounts.constants';

const AccountActivation = ({ match, activateAccount }) => {
  const [redirectToLogin, setRedirectToLogin] = useState(false);

  useEffect(() => {
    activateAccount({ key: match.params.key });
    setRedirectToLogin(true);
  }, [activateAccount, match]);

  // Re-direct to login.
  if (redirectToLogin) {
    return <Redirect to={LOGIN_URL} />;
  }

  return <div></div>;
};

AccountActivation.propTypes = {
  match: PropTypes.object.isRequired,
  activateAccount: PropTypes.func.isRequired
};

export default AccountActivation;
