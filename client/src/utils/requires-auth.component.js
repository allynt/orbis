import React from 'react';

import { Navigate } from 'react-router-dom';

const RequiresAuth = ({ user, redirectTo, children }) => {
  return user ? children : <Navigate to={redirectTo} />;
};

export default RequiresAuth;
