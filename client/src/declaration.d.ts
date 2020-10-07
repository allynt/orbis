declare module '*.module.css' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.png';
declare module '*.webp';

declare type LayerName =
  | 'ClusteredIconLayer'
  | 'CustomMVTLayer'
  | 'GeoJsonClusteredIconLayer'
  | 'GeoJsonLayer';

declare type SourceMetadata = {
  label: string;
  description: string;
  application: {
    orbis: {
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
  metadata: SourceMetadata;
};
