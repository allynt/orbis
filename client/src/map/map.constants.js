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

// FIX-ME make it so the color values and types are
// gotten from fetched data rather than a constant
export const personTypes = [
  {
    name: 'HELPER',
    color: 'green'
  },
  {
    name: 'HELPEE',
    color: 'red'
  }
];
