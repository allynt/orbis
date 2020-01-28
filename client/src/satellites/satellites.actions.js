import { NotificationManager } from 'react-notifications';
import { getData, JSON_HEADERS } from '../utils/http';

export const FETCH_SATELLITES_SUCCESS = 'FETCH_SATELLITES_SUCCESS';
export const FETCH_SATELLITES_FAILURE = 'FETCH_SATELLITES_FAILURE';

export const FETCH_SATELLITE_SCENES_SUCCESS = 'FETCH_SATELLITE_SCENES_SUCCESS';
export const FETCH_SATELLITE_SCENES_FAILURE = 'FETCH_SATELLITE_SCENES_FAILURE';

export const SELECT_SCENE = 'SELECT_SCENE';
export const REMOVE_SCENES = 'REMOVE_SCENES';

export const FETCH_VISUALISATIONS_SUCCESS = 'FETCH_VISUALISATIONS_SUCCESS';
export const FETCH_VISUALISATIONS_FAILURE = 'FETCH_VISUALISATIONS_FAILURE';

const SATELLITES = [
  {
    id: 'sentinel-1',
    label: 'Sentinel-1',
    description: 'Some text describing the Sentinel-1 satellite'
  },
  {
    id: 'sentinel-2',
    label: 'Sentinel-2',
    description: 'Some text describing the Sentinel-2 satellite. the Sentinel-2 satellite'
  },
  {
    id: 'sentinel-3',
    label: 'Sentinel-3',
    description: 'Some text describing the Sentinel-3 satellite. Some text describing the Sentinel-3 satellite'
  },
  {
    id: 'landsat',
    label: 'Landsat',
    description: 'Some text describing the Landsat satellite'
  },
  {
    id: 'envisat-meris',
    label: 'Envisat Meris',
    description: 'Some text describing the Envisat Meris satellite'
  },
  {
    id: 'modis',
    label: 'MODIS',
    description: 'Some text describing the MODIS satellite'
  },
  {
    id: 'proba-v',
    label: 'Proba-V',
    description: 'Some text describing the Proba-V satellite'
  },
  {
    id: 'gibs',
    label: 'GIBS',
    description: 'Some text describing the GIBS satellite'
  }
];

const SATELLITE_SCENES = [
  {
    id: '39UVD',
    properties: {
      label: '39UVD',
      cloudCoverAsPercentage: '4.19',
      created: '2019-12-29T01:00:00Z',
      crs: 'EPSG: 4326'
    },
    thumbnail:
      'https://landsat-pds.s3.amazonaws.com/c1/L8/027/033/LC08_L1TP_027033_20200107_20200114_01_T1/LC08_L1TP_027033_20200107_20200114_01_T1_thumb_small.jpg',
    url:
      'https://staticdata.testing.or3is.com/astrosat/test/sentinel_2_rgb/S2A_20191223T034141_T47NPG_RGB/{z}/{x}/{y}.png'
  },
  {
    id: '38UVD',
    properties: {
      label: '38UVD',
      cloudCoverAsPercentage: '5.19',
      created: '2019-12-29T02:00:00Z',
      crs: 'EPSG: 4326'
    },
    thumbnail:
      'https://landsat-pds.s3.amazonaws.com/c1/L8/027/033/LC08_L1TP_027033_20191222_20200110_01_T1/LC08_L1TP_027033_20191222_20200110_01_T1_thumb_small.jpg',
    url:
      'https://staticdata.testing.or3is.com/astrosat/test/sentinel_2_rgb/S2A_20191223T034141_T47NPG_RGB/{z}/{x}/{y}.png'
  },
  {
    id: '37UVD',
    properties: {
      label: '37UVD',
      cloudCoverAsPercentage: '6.1',
      created: '2019-12-29T03:00:00Z',
      crs: 'EPSG: 4326'
    },
    thumbnail:
      'https://landsat-pds.s3.amazonaws.com/c1/L8/027/033/LC08_L1TP_027033_20191120_20191203_01_T1/LC08_L1TP_027033_20191120_20191203_01_T1_thumb_small.jpg',
    url:
      'https://staticdata.testing.or3is.com/astrosat/test/sentinel_2_rgb/S2A_20191223T034141_T47NPG_RGB/{z}/{x}/{y}.png'
  },
  {
    id: '36UVD',
    properties: {
      label: '36UVD',
      cloudCoverAsPercentage: '4.02',
      created: '2019-12-29T04:00:00Z',
      crs: 'EPSG: 4326'
    },
    thumbnail:
      'https://landsat-pds.s3.amazonaws.com/c1/L8/027/033/LC08_L1TP_027033_20191104_20191115_01_T1/LC08_L1TP_027033_20191104_20191115_01_T1_thumb_small.jpg',
    url:
      'https://staticdata.testing.or3is.com/astrosat/test/sentinel_2_rgb/S2A_20191223T034141_T47NPG_RGB/{z}/{x}/{y}.png'
  },
  {
    id: '35UVD',
    properties: {
      label: '35UVD',
      cloudCoverAsPercentage: '3.43',
      created: '2019-12-29T05:00:00Z',
      crs: 'EPSG: 4326'
    },
    thumbnail:
      'https://landsat-pds.s3.amazonaws.com/c1/L8/027/033/LC08_L1GT_027033_20191003_20191003_01_RT/LC08_L1GT_027033_20191003_20191003_01_RT_thumb_small.jpg',
    url:
      'https://staticdata.testing.or3is.com/astrosat/test/sentinel_2_rgb/S2A_20191223T034141_T47NPG_RGB/{z}/{x}/{y}.png'
  },
  {
    id: '34UVD',
    properties: {
      label: '34UVD',
      cloudCoverAsPercentage: '4.55',
      created: '2019-12-29T06:00:00Z',
      crs: 'EPSG: 4326'
    },
    thumbnail:
      'https://landsat-pds.s3.amazonaws.com/c1/L8/027/033/LC08_L1GT_027033_20190901_20190901_01_RT/LC08_L1GT_027033_20190901_20190901_01_RT_thumb_small.jpg',
    url:
      'https://staticdata.testing.or3is.com/astrosat/test/sentinel_2_rgb/S2A_20191223T034141_T47NPG_RGB/{z}/{x}/{y}.png'
  },
  {
    id: '33UVD',
    properties: {
      label: '33UVD',
      cloudCoverAsPercentage: '2.86',
      created: '2019-12-29T07:00:00Z',
      crs: 'EPSG: 4326'
    },
    thumbnail:
      'https://landsat-pds.s3.amazonaws.com/c1/L8/027/033/LC08_L1TP_027033_20190816_20190902_01_T1/LC08_L1TP_027033_20190816_20190902_01_T1_thumb_small.jpg',
    url:
      'https://staticdata.testing.or3is.com/astrosat/test/sentinel_2_rgb/S2A_20191223T034141_T47NPG_RGB/{z}/{x}/{y}.png'
  },
  {
    id: '32UVD',
    properties: {
      label: '32UVD',
      cloudCoverAsPercentage: '7.23',
      created: '2019-12-29T08:00:00Z',
      crs: 'EPSG: 4326'
    },
    thumbnail:
      'https://landsat-pds.s3.amazonaws.com/c1/L8/027/033/LC08_L1TP_027033_20190613_20190619_01_T1/LC08_L1TP_027033_20190613_20190619_01_T1_thumb_small.jpg',
    url:
      'https://staticdata.testing.or3is.com/astrosat/test/sentinel_2_rgb/S2A_20191223T034141_T47NPG_RGB/{z}/{x}/{y}.png'
  }
];

const VISUALISATIONS = [
  {
    id: 'true-color',
    label: 'True Color',
    description: 'Based on bands 4,3,2',
    thumbnail: 'https://orbis-testing-media.s3-eu-west-1.amazonaws.com/satellites/visualisations/true-color.png'
  },
  {
    id: 'false-color',
    label: 'False Color',
    description: 'Based on bands 4,3,2',
    thumbnail: 'https://orbis-testing-media.s3-eu-west-1.amazonaws.com/satellites/visualisations/false-color.png'
  },
  {
    id: 'false-color-urban',
    label: 'False Color (urban)',
    description: 'Based on bands 4,3,2',
    thumbnail: 'https://orbis-testing-media.s3-eu-west-1.amazonaws.com/satellites/visualisations/false-color-urban.png'
  },
  {
    id: 'ndvi',
    label: 'NDVI',
    description: 'Based on conbination bands (B8A-B4)/(B8A + B11)',
    thumbnail: 'https://orbis-testing-media.s3-eu-west-1.amazonaws.com/satellites/visualisations/ndvi.png'
  }
];

const API = {
  sources: '/api/satellites/',
  scenes: '/api/satellites/imagery/',
  visualisations: '/api/satellites/visualisations/'
};

export const fetchSatellites = () => async (dispatch, getState) => {
  const {
    accounts: { userKey }
  } = getState();
  const headers = {
    ...JSON_HEADERS,
    Authorization: `Token ${userKey}`
  };

  // const response = await getData(API.sources, headers);
  const response = { ok: true };

  if (!response.ok) {
    const message = `${response.status} ${response.statusText}`;

    NotificationManager.error(message, `Fetching Satellites Error - ${response.statusText}`, 50000, () => {});

    return dispatch({
      type: FETCH_SATELLITES_FAILURE,
      error: { message }
    });
  }

  // const satellites = await response.json();
  const satellites = SATELLITES;

  return dispatch({
    type: FETCH_SATELLITES_SUCCESS,
    satellites
  });
};

export const fetchSatelliteScenes = () => async (dispatch, getState) => {
  const {
    accounts: { userKey }
  } = getState();
  const headers = {
    ...JSON_HEADERS,
    Authorization: `Token ${userKey}`
  };

  // const response = await getData(API.scenes, headers);
  const response = { ok: true };

  if (!response.ok) {
    const message = `${response.status} ${response.statusText}`;

    NotificationManager.error(message, `Fetching Satellite Scenes Error - ${response.statusText}`, 50000, () => {});

    return dispatch({
      type: FETCH_SATELLITE_SCENES_FAILURE,
      error: { message }
    });
  }

  // const satellites = await response.json();
  const scenes = SATELLITE_SCENES;

  return dispatch({
    type: FETCH_SATELLITE_SCENES_SUCCESS,
    scenes
  });
};

export const searchSatellites = (selectedSatellites, startDate, endDate) => async dispatch =>
  dispatch(fetchSatelliteScenes());

export const selectScene = scene => ({ type: SELECT_SCENE, scene });

export const removeScenes = () => ({ type: REMOVE_SCENES });

export const fetchVisualisations = () => async (dispatch, getState) => {
  const {
    accounts: { userKey }
  } = getState();
  const headers = {
    ...JSON_HEADERS,
    Authorization: `Token ${userKey}`
  };

  // const response = await getData(API.visualisations, headers);
  const response = { ok: true };

  if (!response.ok) {
    const message = `${response.status} ${response.statusText}`;

    NotificationManager.error(
      message,
      `Fetching Satellite Visualisations Error - ${response.statusText}`,
      50000,
      () => {}
    );

    return dispatch({
      type: FETCH_VISUALISATIONS_FAILURE,
      error: { message }
    });
  }

  // const satellites = await response.json();
  const visualisations = VISUALISATIONS;

  return dispatch({
    type: FETCH_VISUALISATIONS_SUCCESS,
    visualisations
  });
};
