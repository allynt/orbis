type CrowdlessFeatureProperties = {
  placeId: string;
  name: string;
  address: string;
  type: 'supermarket';
  crowdednessScore: number;
  crowdednessCategory: 'not busy' | 'busy' | 'very busy';
};

type CrowdlessFeature = {
  type: 'Feature';
  properties: CrowdlessFeatureProperties;
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
};

type CrowdlessResponseMetadata = {
  nPages?: number;
  radius: string;
  types: string[];
  timestamp: string;
  center: {
    latitude: string;
    longitude: string;
  };
};

type CrowdlessResponse = {
  type: 'FeatureCollection';
  id: number;
  features: CrowdlessFeature[];
  requestMetadata: CrowdlessResponseMetadata;
};
