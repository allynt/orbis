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
  aggregates?: {
    GB: number;
    Scotland: number;
    England: number;
    Wales: number;
  };
  aggregation?: 'sum' | 'mean';
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
  breakdown?: string[];
  clip_min?: number;
  clip_max?: number;
  description?: string;
  details?: string;
  label?: string;
  max: number;
  min: number;
  name: string;
  precision?: number;
  property_group?: string;
  source?: string;
  type: PropertyType;
  units?: string;
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

type AnalysisPanelComponent<P = {}> = (
  props: {
    selectedProperty: Property;
    clickedFeatures: any[];
  } & P,
) => JSX.Element;

type PickedMapFeature<P = {}> = {
  layer: {
    id: string;
  };
  object: { properties: {} & P };
};

type PolygonPickedMapFeature = PickedMapFeature<{
  index: string;
}>;
