import { ReactComponent as ProfileIcon } from './side-panel/side-panel-icons/profile-icon.svg';
import { ReactComponent as SavedDocumentsIcon } from './side-panel/side-panel-icons/saved-documents.svg';
import { ReactComponent as StorageIcon } from './side-panel/side-panel-icons/storage-icon.svg';
import { ReactComponent as StoreIcon } from './side-panel/side-panel-icons/store-icon.svg';
import { ReactComponent as SubscriptionsIcon } from './side-panel/side-panel-icons/subscriptions-icon.svg';
import { ReactComponent as SupportIcon } from './side-panel/side-panel-icons/support-icon.svg';
import { ReactComponent as UsersIcon } from './side-panel/side-panel-icons/users-icon.svg';

/** @type {Record<string, {label: string, route: string, Icon?: any, admin?: boolean}>} */
export const VIEWS = {
  store: {
    label: 'Orbis Store',
    route: '/store',
    Icon: StoreIcon,
    admin: true,
  },
  accountDetails: {
    label: 'Account Details',
    route: '/account-details',
    Icon: ProfileIcon,
    admin: true,
  },
  savedDocuments: {
    label: 'Saved Documents',
    route: '/saved-documents',
    Icon: SavedDocumentsIcon,
  },
  users: { label: 'Users', route: '/users', Icon: UsersIcon, admin: true },
  subscriptions: {
    label: 'Subscriptions',
    route: '/subscriptions',
    Icon: SubscriptionsIcon,
    admin: true,
  },
  support: { label: 'Support', route: '/support', Icon: SupportIcon },
  storage: { label: 'Storage', route: '/storage', Icon: StorageIcon },
};

export const ORGANISATION_TYPES = [
  { name: 'None', value: undefined },
  { name: 'Non-Profit Organisation', value: 'NON_PROFIT' },
  { name: 'Local Authority', value: 'LOCAL_AUTHORITY' },
  { name: 'Government & Executive Agencies', value: 'GOV_AND_EXEC_AGENCIES' },
  { name: 'Non Departmental Public Body', value: 'NON_DEPT_PUBLIC_BODY' },
  { name: 'Public Corporation', value: 'PUBLIC_CORP' },
  { name: 'Health & Care', value: 'HEALTH_AND_CARE' },
  { name: 'Charity', value: 'CHARITY' },
  {
    name: 'Academics, School or any kind of Education',
    value: 'ACADEMICS_OR_EDUCATION',
  },
  { name: 'Other', value: 'OTHER' },
];

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
