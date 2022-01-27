import React from 'react';

import { Navigate } from 'react-router-dom';

const RequiresAdmin = ({ user, redirectTo, children }) => {
  return user?.customers.some(customer => customer.type === 'MANAGER') ? (
    children
  ) : (
    <Navigate to={redirectTo} />
  );
};

export default RequiresAdmin;
