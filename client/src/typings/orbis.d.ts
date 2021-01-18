import {} from 'd3-scale-chromatic';

type LayerName =
  | 'ClusteredIconLayer'
  | 'CustomMVTLayer'
  | 'GeoJsonClusteredIconLayer'
  | 'GeoJsonLayer'
  | 'IconLayer';

type ColorMap =
  | 'BrBG'
  | 'PRGn'
  | 'PiYG'
  | 'PuOr'
  | 'RdBu'
  | 'RdGy'
  | 'RdYlBu'
  | 'RdYlGn'
  | 'Spectral'
  | 'Blues'
  | 'Greens'
  | 'Greys'
  | 'Oranges'
  | 'Purples'
  | 'Reds'
  | 'Turbo'
  | 'Viridis'
  | 'Inferno'
  | 'Magma'
  | 'Plasma'
  | 'Cividis'
  | 'Warm'
  | 'Cool'
  | 'Rainbow'
  | 'Sinebow'
  | 'CubehelixDefault'
  | 'BuGn'
  | 'BuPu'
  | 'GnBu'
  | 'PuBuGn'
  | 'PuBu'
  | 'OrRd'
  | 'PuRd'
  | 'RdPu'
  | 'YlGnBu'
  | 'YlGn'
  | 'YlOrBr'
  | 'YlOrRd';

type PropertyType = 'continuous' | 'decile' | 'discrete';

type Orb = { name: string; description?: string };

type SourceCategories = {
  name: string;
  child?: SourceCategories;
};

type OrbisApplicationMetadata = {
  orbs?: Orb[];
  categories: SourceCategories;
  layer?: {
    name: LayerName;
    props?: {
      config?: string;
      [key: string]: any;
    };
  };
  map_component?: {
    name: string;
    props?: any;
  };
  sidebar_component?: {
    name: string;
    props?: any;
  };
};

type Property = {
  name: string;
  label?: string;
  description?: string;
  type: PropertyType;
  units?: 'string';
  min: number;
  max: number;
  clip_min?: number;
  clip_max?: number;
  aggregation?: 'sum' | 'mean';
  aggregates?: {
    GB: number;
    Scotland: number;
    England: number;
    Wales: number;
  };
  property_group?: string;
  application: {
    orbis?: {
      label?: string;
      data_visualisation_components?: any;
      display?: {
        colormap_reversed?: boolean;
        color: ColorMap;
      };
    };
  };
};

type SourceMetadata = {
  label: string;
  description?: string;
  domain?: string;
  properties: Property[];
  tiles?: string | string[];
  url?: string;
  api_key?: string;
  request_strategy?: 'manual' | 'automatic' | 'lazy' | 'normal';
  application?: {
    orbis: OrbisApplicationMetadata;
  };
};

type Source = {
  authority: string;
  namespace: string;
  name: string;
  version: string;
  source_id: string;
  domain?: string;
  metadata: SourceMetadata;
};

type CategoryHierarchy = {
  category: string;
  sources: CategorisedSources;
};

type CategorisedSources = (CategoryHierarchy | Source)[];

type OrbWithCategorisedSources = Orb & { sources: CategorisedSources };

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
  is_verified: boolean;
  name?: string;
  permissions?: string[];
  registration_stage?: 'USER' | 'CUSTOMER' | 'CUSTOMER_USER' | 'ORDER';
  roles?: string[];
  username: string;
};

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

type Bookmark = {
  id: number;
  owner: User['id'];
  title: string;
  description?: string;
  created: string;
  zoom: number;
  center: [number, number];
  layers: Source['source_id'][];
  thumbnail?: string;
};
