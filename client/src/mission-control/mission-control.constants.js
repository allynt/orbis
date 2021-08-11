import { ReactComponent as StoreIcon } from './side-panel/side-panel-icons/store-icon.svg';
import { ReactComponent as UsersIcon } from './side-panel/side-panel-icons/users-icon.svg';

/** @type {Record<string, {label: string, route: string, Icon?: any, admin?: boolean}>} */
export const VIEWS = {
  store: {
    label: 'Orbis Store',
    route: '/store',
    Icon: StoreIcon,
    admin: true,
  },
  users: { label: 'Users', route: '/users', Icon: UsersIcon },
  subscriptions: { label: 'Subscriptions', route: '/subscriptions' },
  other: { label: 'Other', route: '/other' },
};

export const ADMIN_STATUS = {
  manager: 'MANAGER',
  member: 'MEMBER',
};

export const USER_STATUS = {
  pending: 'PENDING',
  active: 'ACTIVE',
};

export const ADMIN_VIEW = {
  home: 'Home',
  corporateAccount: 'Corporate Account',
  licenceDashboard: 'Licence Dashboard',
};

export const DIALOG_VIEW = {
  createUser: 'Create New User',
  withdrawInvitation: 'Confirm',
  editUser: 'Edit User',
  deleteUser: 'Verify Update',
};

export const ROWS_PER_PAGE_OPTIONS = ['5', '10', '15', '20'];
