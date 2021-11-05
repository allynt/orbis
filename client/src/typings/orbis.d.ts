import { GeometryTypes } from '@turf/helpers';
import { Dispatch } from 'redux';

import { OrbState } from '../map/orbs/orbReducer'; // eslint-disable-line

type LayerName =
  | 'ClusteredIconLayer'
  | 'CustomMVTLayer'
  | 'GeoJsonClusteredIconLayer'
  | 'GeoJsonLayer'
  | 'IconLayer'
  | 'BitmapLayer'
  | 'TileLayer'
  | 'HeatmapLayer'
  | 'HexagonLayer';

type CategoricalColorMaps =
  | 'Category10'
  | 'Accent'
  | 'Dark2'
  | 'Paired'
  | 'Pastel1'
  | 'Pastel2'
  | 'Set1'
  | 'Set2'
  | 'Set3'
  | 'Tableau10';

type ContinuousColorMaps =
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

type FeatureKey = 'satellites';

type ColorMap = CategoricalColorMaps | ContinuousColorMaps;

type PropertyType = 'continuous' | 'decile' | 'discrete' | 'percentage';

type Orb = {
  id: number;
  name: string;
  short_description?: string;
  description?: string;
  licence_cost: number;
  logo: string;
  images: string[];
  features?: FeatureKey[];
  terms_document?: string;
  can_purchase?: boolean;
};

type SourceCategories = {
  name: string;
  child?: SourceCategories;
};

type ComponentDefinition<P = {}> = {
  name: string;
  props?: P;
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
  map_component?: ComponentDefinition;
  sidebar_component?: ComponentDefinition;
};

type BaseProperty = {
  application: {
    orbis?: {
      label?: string;
      description?: string;
      data_visualisation_components?: ComponentDefinition<any>[];
      display?: {
        colormap_reversed?: boolean;
        color: ColorMap;
        property_toggle_label?: string;
      };
    };
  };
  description?: string;
  details?: string | string[];
  label?: string;
  name: string;
  precision?: number;
  property_group?: string;
  source?: string;
  type: PropertyType;
  timeseries?: boolean;
  timeseries_timestamps?: string[];
  timeseries_latest_timestamp?: string;
};

type ContinuousProperty = {
  aggregates?: {
    GB: number;
    Scotland: number;
    England: number;
    Wales: number;
  };
  aggregation?: 'sum' | 'mean';
  breakdown?: string[];
  clip_min?: number;
  clip_max?: number;
  max: number;
  min: number;

  units?: string;
} & BaseProperty;

type DiscreteProperty = {
  categories: {
    [category: string]: {
      color: string;
      description?: string;
    };
  };
} & BaseProperty;

type Property = ContinuousProperty | DiscreteProperty;

type SourceMetadata = {
  label: string;
  description?: string;
  domain?: string;
  properties: Property[];
  tiles?: string | string[];
  url?: string;
  api_key?: string;
  index?: string;
  minZoom?: number;
  maxZoom?: number;
  request_strategy?: 'manual' | 'automatic' | 'lazy' | 'normal';
  licence?: string;
  provenance?: {
    sources?: (string | { text: string; src: string })[];
    creators?: string[];
    documentation?: string[];
  };
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
  data?: any;
};

type CategoryHierarchy = {
  category: string;
  sources: CategorisedSources;
};

type CategorisedSources = (CategoryHierarchy | Source)[];

type OrbWithCategorisedSources = Orb & { sources: CategorisedSources };

/**
 * @typeParam P - Extra props which are available on the component
 * @typeParam F - The type of the picked features
 */
type AnalysisPanelComponent<P = {}, F extends PickedMapFeature = {}> = (
  props: {
    selectedProperty: Property;
    clickedFeatures: F[];
    hoveredFeatures: F[];
    dispatch?: Dispatch;
  } & P,
) => JSX.Element;

/**
 * @typeParam P - Extra props which are available on the component
 */
type SidebarComponent<P = {}> = (
  props: {
    selectedLayer?: Source;
    dispatch?: Dispatch;
  } & P,
) => JSX.Element;

/**
 * @typeParam P - Extra props which are available on the component
 */
type MapComponent<P = {}> = (
  props: {
    source: Source;
  } & P,
) => JSX.Element;

type GeoJsonFeature<P = {}> = {
  geometry: {
    type: GeometryTypes;
    coordinates?: number[];
  };
  properties: { cluster?: boolean; expansion_zoom?: number } & P;
};

type LayerConfiguration<P = {}> = (
  props: {
    id: string;
    data: any;
    orbState: OrbState;
    authToken: string;
    activeSources: Source[];
    dispatch: Dispatch;
  } & P,
) => any;

/** A feature which has been picked from the map by onHover or onClick */
type PickedMapFeature<P = {}> = {
  layer: {
    id: string;
    props?: {
      uniqueIdProperty?: string;
    };
  };
  index: number;
  /** The underlying GeoJson object */
  object: GeoJsonFeature<P>;
  objects?: GeoJsonFeature<P>[];
};

type IsoPlusCommonProperties = {
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
};

type PolygonPickedMapFeature = PickedMapFeature<IsoPlusCommonProperties>;

type DateRange<T> = {
  startDate: T;
  endDate: T;
};

type AppConfig = {
  trackingId?: string;
  mapbox_token?: string;
  passwordMinLength?: number;
  passwordMaxLength?: number;
  isRegistrationOpen?: boolean;
  isVerificationRequired?: boolean;
  isApprovalRequired?: boolean;
  maximumAoiArea?: number;
  dataIndexUrl?: string;
  commitSha?: string;
  geometrySet?: {
    name: string;
    order: number;
  };
  userTrackingInterval?: number;
};
