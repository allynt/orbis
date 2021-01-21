import { Dispatch } from 'redux';

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

/**
 * Thing
 * @typeParam P - Extra props which are available on the component
 * @typeParam F - The type of the picked features
 */
type AnalysisPanelComponent<P = {}, F extends PickedMapFeature = {}> = (
  props: {
    selectedProperty: Property;
    clickedFeatures: F[];
    dispatch?: Dispatch;
  } & P,
) => JSX.Element;

/** A feature which has been picked from the map by onHover or onClick */
type PickedMapFeature<P = {}> = {
  layer: {
    id: string;
  };
  index: number;
  /** The underlying GeoJson object */
  object: { properties: {} & P };
};

type PolygonPickedMapFeature = PickedMapFeature<{
  /** Human readable name for the area */
  area_name?: string;
  /** Number of households within the area */
  households?: number;
  /** Population value for the area */
  population?: number;
  /** Year of the census the population value is from */
  population_year?: string;
  within_lad?: any;
  within_lad_name?: any;
  within_lsoa?: any;
  within_msoa?: any;
  /** Typically the OA/LAD/LSOA/MSOA Area code */
  index: string;
}>;
