enum CustomerUserType {
  MANAGER = 'MANAGER',
  MEMBER = 'MEMBER',
}

enum CustomerUserStatus {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
}

type User = {
  accepted_terms: boolean;
  avatar?: string;
  change_password: boolean;
  customers?: { type: CustomerUserType; status: CustomerUserStatus }[];
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

type Customer = {
  id: string;
  type?: 'MULTIPLE' | 'INDIVIDUAL';
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
  licences?: Licence[];
};
