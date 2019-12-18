import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Redirect } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { activateAccount } from './accounts.actions';

const AccountActivation = ({ match }) => {
  const [redirectToLogin, setRedirectToLogin] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(activateAccount({ key: match.params.key }));
    setRedirectToLogin(true);
  }, []);

  // Re-direct to login.
  if (redirectToLogin) {
    return <Redirect to="/login" />;
  }

  return <div></div>;
};

AccountActivation.propTypes = {
  match: PropTypes.object.isRequired
};

export default AccountActivation;
