import { useSelector } from 'react-redux';

import { userSelector } from 'accounts/accounts.selectors';

/**
 * Check if the current user has the provided role or roles
 * @param {string[]} roles The roles to check
 * @returns {boolean} Returns true if the user has **any** of the provided roles
 */
const useUserRoleAuthorization = roles => {
  const user = useSelector(userSelector);
  if (!user || !user.roles || user.roles.length === 0) return false;
  return user.roles.some(role => roles.includes(role));
};

export default useUserRoleAuthorization;
