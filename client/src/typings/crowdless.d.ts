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
  radius: number;
  types: string[];
  timestamp: string;
  center: {
    latitude: number;
    longitude: number;
  };
};

type CrowdlessResponse = {
  type: 'FeatureCollection';
  id: number;
  features: CrowdlessFeature[];
  requestMetadata: CrowdlessResponseMetadata;
};
