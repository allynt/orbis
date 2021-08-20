import { Orb } from './orbis';

type CustomerUserType = 'MANAGER' | 'MEMBER';

type CustomerUserStatus = 'ACTIVE' | 'PENDING';

type FeatureKey = 'satellites';

type User = {
  accepted_terms: boolean;
  avatar?: string;
  change_password: boolean;
  customers?: {
    id: Customer['id'];
    type: CustomerUserType;
    status: CustomerUserStatus;
  }[];
  description?: string;
  email: string;
  id: string;
  is_approved: boolean;
  is_verified: boolean | 'False' | 'True';
  name?: string;
  permissions?: string[];
  registration_stage?: 'USER' | 'CUSTOMER' | 'CUSTOMER_USER' | 'ORDER';
  roles?: string[];
  username: string;
  orbs?: Orb[];
};

type PartialUser = Pick<
  User,
  | 'username'
  | 'email'
  | 'id'
  | 'is_verified'
  | 'is_approved'
  | 'registration_stage'
  | 'change_password'
  | 'accepted_terms'
>;

type Licence = {
  id: string;
  orb: string;
  customer: string;
  customer_user?: number;
  access?: number;
};

type CustomerUser = {
  id: number;
  type: CustomerUserType;
  status: CustomerUserStatus;
  invitation_date?: string;
  user?: User;
  licences?: Licence['id'][];
};

type CustomerType = 'MULTIPLE' | 'INDIVIDUAL';

type Customer = {
  id: string;
  type?: CustomerType;
  name: string;
  official_name?: string;
  company_type?: string;
  registered_id?: string;
  description?: string;
  logo?: string;
  url?: string;
  country?: string;
  address?: string;
  postcode?: string;
  vat_number?: string;
  licences?: Licence[];
};

type Order = {
  id: string;
  report: string;
  user: string;
  customer: string;
  created: string;
  order_type: string;
  cost: number;
  items: {
    id: number;
    orb: string;
    n_licences: number;
    cost: number;
    subscription_period: number;
    expiration: string;
  }[];
};
