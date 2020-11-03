declare module '*.module.css' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.png';
declare module '*.svg';
declare module '*.webp';

declare type LayerName =
  | 'ClusteredIconLayer'
  | 'CustomMVTLayer'
  | 'GeoJsonClusteredIconLayer'
  | 'GeoJsonLayer';

type Category = {
  name: string;
  child: Category;
};

declare type SourceMetadata = {
  label: string;
  description: string;
  application: {
    orbis: {
      categories: Category;
      layer: {
        name: LayerName;
        props?: {
          config?: string;
          [key: string]: any;
        };
      };
      map_component: {
        name: string;
        props?: any;
      };
      sidebar_component: {
        name: string;
        props?: any;
      };
    };
  };
};

declare type Source = {
  authority: string;
  namespace: string;
  name: string;
  version: string;
  source_id: string;
  domain?: string;
  orbs?: { name: string; description?: string }[];
  metadata: SourceMetadata;
};

declare type User = {
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
