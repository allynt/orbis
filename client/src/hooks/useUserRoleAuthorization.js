import { useSelector } from 'react-redux';

import { userSelector } from 'accounts/accounts.selectors';

/**
 * @param {string[]} roles
 * @returns {boolean}
 */
const useUserRoleAuthorization = roles => {
  const user = useSelector(userSelector);
  if (!user || !user.roles || user.roles.length === 0) return false;
  return user.roles.some(role => roles.includes(role));
};

export default useUserRoleAuthorization;
