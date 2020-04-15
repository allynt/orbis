import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

import { LOGIN_URL } from '../accounts/accounts.constants';

const PrivateRoute = ({ component: Component, user, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      user ? (
        <Component {...props} {...rest} />
      ) : (
        <Redirect to={{ pathname: `${LOGIN_URL}`, state: { from: props.location } }} />
      )
    }
  />
);

PrivateRoute.propTypes = {
  user: PropTypes.object
};

export default PrivateRoute;
