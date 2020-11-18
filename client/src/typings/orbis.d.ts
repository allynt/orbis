type LayerName =
  | 'ClusteredIconLayer'
  | 'CustomMVTLayer'
  | 'GeoJsonClusteredIconLayer'
  | 'GeoJsonLayer';

type ColorMap =
  | 'OrRd'
  | 'PuBu'
  | 'BuPu'
  | 'Oranges'
  | 'BuGn'
  | 'YlOrBr'
  | 'YlGn'
  | 'Reds'
  | 'RdPu'
  | 'Greens'
  | 'YlGnBu'
  | 'Purples'
  | 'GnBu'
  | 'Greys'
  | 'YlOrRd'
  | 'PuRd'
  | 'Blues'
  | 'PuBuGn'
  | 'Spectral'
  | 'RdYlGn'
  | 'RdBu'
  | 'PiYG'
  | 'PRGn'
  | 'RdYlBu'
  | 'BrBG'
  | 'RdGy'
  | 'PuOr'
  | 'Set2'
  | 'Accent'
  | 'Set1'
  | 'Set3'
  | 'Dark2'
  | 'Paired'
  | 'Pastel2'
  | 'Pastel1';

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
  application: {
    orbis?: {
      label?: string;
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
  manual?: boolean;
};

type CategoryHierarchy = {
  category: string;
  sources: CategorisedSources;
};

type CategorisedSources = (CategoryHierarchy | Source)[];

type OrbWithCategorisedSources = Orb & { sources: CategorisedSources };

type User = {
  accepted_terms: boolean;
  avatar?: string;
  change_password: boolean;
  customers?: { type: 'MANAGER' | 'MEMBER'; status: 'ACTIVE' | 'PENDING' }[];
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
