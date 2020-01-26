export const VECTOR = 'vector';
export const RASTER = 'raster';
export const GEOJSON = 'geojson';

export const regions = [
  {
    name: 'Europe',
    value: {
      zoom: 6,
      center: [2.588083, 48.953583]
    }
  },
  {
    name: 'Africa',
    value: {
      zoom: 6,
      center: [23.44175, 0.0]
    }
  },
  {
    name: 'Central Asia',
    value: {
      zoom: 6,
      center: [68.110556, 45.517806]
    }
  },
  {
    name: 'North America',
    value: {
      zoom: 6,
      center: [-104.634381, 51.83855]
    }
  }
];

export const MAP_STYLE_DATA = [
  {
    id: 'streets',
    uri: 'mapbox://styles/mapbox/streets-v11',
    title: 'Streets'
  },
  {
    id: 'light',
    uri: 'mapbox://styles/mapbox/light-v10',
    title: 'Light'
  },
  {
    id: 'dark',
    uri: 'mapbox://styles/mapbox/dark-v10',
    title: 'Dark'
  },
  {
    id: 'satellite',
    uri: 'mapbox://styles/mapbox/satellite-v9',
    title: 'Satellite'
  }
];

export const domains = [
  {
    name: 'TropoSense',
    value: 'troposense'
  },
  {
    name: 'Rice Paddies',
    value: 'ricepaddies'
  },
  {
    name: 'Marine Pollution',
    value: 'marinepolution'
  },
  {
    name: 'Forestry & Landslides',
    value: 'forestryandlandslides'
  }
];
