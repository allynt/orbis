import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

import { LOGIN } from '../accounts/accounts.constants';

const PrivateRoute = ({ component: Component, user, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      user ? (
        <Component user={user} {...props} {...rest} />
      ) : (
        <Redirect
          to={{ pathname: `${LOGIN}`, state: { from: props.location } }}
        />
      )
    }
  />
);

PrivateRoute.propTypes = {
  user: PropTypes.object,
};

export default PrivateRoute;
