import React from 'react';

import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import Satellites from './satellites-panel.component';
import { fetchPinnedScenes } from './satellites.slice';

const mockStore = configureMockStore([thunk]);

const MAPSTYLES = [
  {
    id: 'light',
    uri: 'mapbox://styles/mapbox/light-v10',
    title: 'Light',
  },
  {
    id: 'dark',
    uri: 'mapbox://styles/mapbox/dark-v10',
    title: 'Dark',
  },
];

const baseStore = {
  accounts: { userKey: null },
  app: {
    config: {
      mapbox_token: 'token',
      mapStyles: MAPSTYLES,
    },
  },
  map: {
    isCompareMode: false,
  },
};

const satellites = [
  {
    id: 'sentinel-1',
    label: 'Sentinel-1',
    description: 'Some text describing the Sentinel-1 satellite',
    tiers: [
      {
        id: 'free',
        label: 'Free Images',
        description: 'Free scenes.',
      },
      {
        id: 'mid',
        label: 'Mid Resolution',
        description: 'Mid resolution scenes.',
      },
      {
        id: 'high',
        label: 'High Resolution',
        description: 'High resolution scenes.',
      },
    ],
    visualisations: [
      {
        id: 'true-color',
        label: 'True Color',
        description: 'Based on bands 4,3,2',
        thumbnail:
          'https://cnet4.cbsistatic.com/img/-JKG69A9xmdlvxVwYtpIztVHxHI=/940x0/2018/08/21/09803db6-578f-41f7-9c7a-0b9efc5d6751/starshot-satellite-launch.jpg',
      },
      {
        id: 'false-color',
        label: 'False Color',
        description: 'Based on bands 4,3,2',
        thumbnail:
          'https://cnet4.cbsistatic.com/img/-JKG69A9xmdlvxVwYtpIztVHxHI=/940x0/2018/08/21/09803db6-578f-41f7-9c7a-0b9efc5d6751/starshot-satellite-launch.jpg',
      },
      {
        id: 'false-color-urban',
        label: 'False Color (urban)',
        description: 'Based on bands 4,3,2',
        thumbnail:
          'https://cnet4.cbsistatic.com/img/-JKG69A9xmdlvxVwYtpIztVHxHI=/940x0/2018/08/21/09803db6-578f-41f7-9c7a-0b9efc5d6751/starshot-satellite-launch.jpg',
      },
      {
        id: 'ndvi',
        label: 'NDVI',
        description: 'Based on conbination bands (B8A-B4)/(B8A + B11)',
        thumbnail:
          'https://cnet4.cbsistatic.com/img/-JKG69A9xmdlvxVwYtpIztVHxHI=/940x0/2018/08/21/09803db6-578f-41f7-9c7a-0b9efc5d6751/starshot-satellite-launch.jpg',
      },
    ],
  },
  {
    id: 'sentinel-2',
    label: 'Sentinel-2',
    description: 'Some text describing the Sentinel-2 satellite.',
    tiers: [
      {
        id: 'free',
        label: 'Free Images',
        description: 'Free scenes.',
      },
      {
        id: 'mid',
        label: 'Mid Resolution',
        description: 'Mid resolution scenes.',
      },
      {
        id: 'high',
        label: 'High Resolution',
        description: 'High resolution scenes.',
      },
    ],
    visualisations: [
      {
        id: 'true-color',
        label: 'True Color',
        description: 'Based on bands 4,3,2',
        thumbnail:
          'https://cnet4.cbsistatic.com/img/-JKG69A9xmdlvxVwYtpIztVHxHI=/940x0/2018/08/21/09803db6-578f-41f7-9c7a-0b9efc5d6751/starshot-satellite-launch.jpg',
      },
      {
        id: 'false-color',
        label: 'False Color',
        description: 'Based on bands 4,3,2',
        thumbnail:
          'https://cnet4.cbsistatic.com/img/-JKG69A9xmdlvxVwYtpIztVHxHI=/940x0/2018/08/21/09803db6-578f-41f7-9c7a-0b9efc5d6751/starshot-satellite-launch.jpg',
      },
      {
        id: 'false-color-urban',
        label: 'False Color (urban)',
        description: 'Based on bands 4,3,2',
        thumbnail:
          'https://cnet4.cbsistatic.com/img/-JKG69A9xmdlvxVwYtpIztVHxHI=/940x0/2018/08/21/09803db6-578f-41f7-9c7a-0b9efc5d6751/starshot-satellite-launch.jpg',
      },
      {
        id: 'ndvi',
        label: 'NDVI',
        description: 'Based on conbination bands (B8A-B4)/(B8A + B11)',
        thumbnail:
          'https://cnet4.cbsistatic.com/img/-JKG69A9xmdlvxVwYtpIztVHxHI=/940x0/2018/08/21/09803db6-578f-41f7-9c7a-0b9efc5d6751/starshot-satellite-launch.jpg',
      },
    ],
  },
  {
    id: 'sentinel-3',
    label: 'Sentinel-3',
    description: 'Some text describing the Sentinel-3 satellite.',
    tiers: [
      {
        id: 'free',
        label: 'Free Images',
        description: 'Free scenes.',
      },
      {
        id: 'mid',
        label: 'Mid Resolution',
        description: 'Mid resolution scenes.',
      },
      {
        id: 'high',
        label: 'High Resolution',
        description: 'High resolution scenes.',
      },
    ],
    visualisations: [
      {
        id: 'true-color',
        label: 'True Color',
        description: 'Based on bands 4,3,2',
        thumbnail:
          'https://cnet4.cbsistatic.com/img/-JKG69A9xmdlvxVwYtpIztVHxHI=/940x0/2018/08/21/09803db6-578f-41f7-9c7a-0b9efc5d6751/starshot-satellite-launch.jpg',
      },
      {
        id: 'false-color',
        label: 'False Color',
        description: 'Based on bands 4,3,2',
        thumbnail:
          'https://cnet4.cbsistatic.com/img/-JKG69A9xmdlvxVwYtpIztVHxHI=/940x0/2018/08/21/09803db6-578f-41f7-9c7a-0b9efc5d6751/starshot-satellite-launch.jpg',
      },
      {
        id: 'false-color-urban',
        label: 'False Color (urban)',
        description: 'Based on bands 4,3,2',
        thumbnail:
          'https://cnet4.cbsistatic.com/img/-JKG69A9xmdlvxVwYtpIztVHxHI=/940x0/2018/08/21/09803db6-578f-41f7-9c7a-0b9efc5d6751/starshot-satellite-launch.jpg',
      },
      {
        id: 'ndvi',
        label: 'NDVI',
        description: 'Based on conbination bands (B8A-B4)/(B8A + B11)',
        thumbnail:
          'https://cnet4.cbsistatic.com/img/-JKG69A9xmdlvxVwYtpIztVHxHI=/940x0/2018/08/21/09803db6-578f-41f7-9c7a-0b9efc5d6751/starshot-satellite-launch.jpg',
      },
    ],
  },
  {
    id: 'landsat',
    label: 'Landsat',
    description: 'Some text describing the Landsat satellite',
    tiers: [
      {
        id: 'free',
        label: 'Free Images',
        description: 'Free scenes.',
      },
      {
        id: 'mid',
        label: 'Mid Resolution',
        description: 'Mid resolution scenes.',
      },
      {
        id: 'high',
        label: 'High Resolution',
        description: 'High resolution scenes.',
      },
    ],
    visualisations: [
      {
        id: 'ndvi',
        label: 'NDVI',
        description: 'Based on conbination bands (B8A-B4)/(B8A + B11)',
        thumbnail:
          'https://cnet4.cbsistatic.com/img/-JKG69A9xmdlvxVwYtpIztVHxHI=/940x0/2018/08/21/09803db6-578f-41f7-9c7a-0b9efc5d6751/starshot-satellite-launch.jpg',
      },
      {
        id: 'false-color-urban',
        label: 'False Color (urban)',
        description: 'Based on bands 4,3,2',
        thumbnail:
          'https://cnet4.cbsistatic.com/img/-JKG69A9xmdlvxVwYtpIztVHxHI=/940x0/2018/08/21/09803db6-578f-41f7-9c7a-0b9efc5d6751/starshot-satellite-launch.jpg',
      },
      {
        id: 'false-color',
        label: 'False Color',
        description: 'Based on bands 4,3,2',
        thumbnail:
          'https://cnet4.cbsistatic.com/img/-JKG69A9xmdlvxVwYtpIztVHxHI=/940x0/2018/08/21/09803db6-578f-41f7-9c7a-0b9efc5d6751/starshot-satellite-launch.jpg',
      },
      {
        id: 'true-color',
        label: 'True Color',
        description: 'Based on bands 4,3,2',
        thumbnail:
          'https://cnet4.cbsistatic.com/img/-JKG69A9xmdlvxVwYtpIztVHxHI=/940x0/2018/08/21/09803db6-578f-41f7-9c7a-0b9efc5d6751/starshot-satellite-launch.jpg',
      },
    ],
  },
  {
    id: 'envisat-meris',
    label: 'Envisat Meris',
    description: 'Some text describing the Envisat Meris satellite',
    tiers: [
      {
        id: 'free',
        label: 'Free Images',
        description: 'Free scenes.',
      },
      {
        id: 'mid',
        label: 'Mid Resolution',
        description: 'Mid resolution scenes.',
      },
      {
        id: 'high',
        label: 'High Resolution',
        description: 'High resolution scenes.',
      },
    ],
    visualisations: [
      {
        id: 'ndvi',
        label: 'NDVI',
        description: 'Based on conbination bands (B8A-B4)/(B8A + B11)',
        thumbnail:
          'https://cnet4.cbsistatic.com/img/-JKG69A9xmdlvxVwYtpIztVHxHI=/940x0/2018/08/21/09803db6-578f-41f7-9c7a-0b9efc5d6751/starshot-satellite-launch.jpg',
      },
      {
        id: 'false-color-urban',
        label: 'False Color (urban)',
        description: 'Based on bands 4,3,2',
        thumbnail:
          'https://cnet4.cbsistatic.com/img/-JKG69A9xmdlvxVwYtpIztVHxHI=/940x0/2018/08/21/09803db6-578f-41f7-9c7a-0b9efc5d6751/starshot-satellite-launch.jpg',
      },
      {
        id: 'false-color',
        label: 'False Color',
        description: 'Based on bands 4,3,2',
        thumbnail:
          'https://cnet4.cbsistatic.com/img/-JKG69A9xmdlvxVwYtpIztVHxHI=/940x0/2018/08/21/09803db6-578f-41f7-9c7a-0b9efc5d6751/starshot-satellite-launch.jpg',
      },
      {
        id: 'true-color',
        label: 'True Color',
        description: 'Based on bands 4,3,2',
        thumbnail:
          'https://cnet4.cbsistatic.com/img/-JKG69A9xmdlvxVwYtpIztVHxHI=/940x0/2018/08/21/09803db6-578f-41f7-9c7a-0b9efc5d6751/starshot-satellite-launch.jpg',
      },
    ],
  },
  {
    id: 'modis',
    label: 'MODIS',
    description: 'Some text describing the MODIS satellite',
    tiers: [
      {
        id: 'free',
        label: 'Free Images',
        description: 'Free scenes.',
      },
      {
        id: 'mid',
        label: 'Mid Resolution',
        description: 'Mid resolution scenes.',
      },
      {
        id: 'high',
        label: 'High Resolution',
        description: 'High resolution scenes.',
      },
    ],
    visualisations: [
      {
        id: 'ndvi',
        label: 'ndvi',
        description: 'This is a description of this visualization',
        thumbnail:
          'https://landsat-pds.s3.amazonaws.com/c1/L8/027/033/LC08_L1TP_027033_20200107_20200114_01_T1/LC08_L1TP_027033_20200107_20200114_01_T1_thumb_small.jpg',
      },
    ],
  },
  {
    id: 'proba-v',
    label: 'Proba-V',
    description: 'Some text describing the Proba-V satellite',
    tiers: [
      {
        id: 'free',
        label: 'Free Images',
        description: 'Free scenes.',
      },
      {
        id: 'mid',
        label: 'Mid Resolution',
        description: 'Mid resolution scenes.',
      },
      {
        id: 'high',
        label: 'High Resolution',
        description: 'High resolution scenes.',
      },
    ],
    visualisations: [
      {
        id: 'ndvi',
        label: 'NDVI',
        description: 'Based on conbination bands (B8A-B4)/(B8A + B11)',
        thumbnail:
          'https://cnet4.cbsistatic.com/img/-JKG69A9xmdlvxVwYtpIztVHxHI=/940x0/2018/08/21/09803db6-578f-41f7-9c7a-0b9efc5d6751/starshot-satellite-launch.jpg',
      },
      {
        id: 'false-color-urban',
        label: 'False Color (urban)',
        description: 'Based on bands 4,3,2',
        thumbnail:
          'https://cnet4.cbsistatic.com/img/-JKG69A9xmdlvxVwYtpIztVHxHI=/940x0/2018/08/21/09803db6-578f-41f7-9c7a-0b9efc5d6751/starshot-satellite-launch.jpg',
      },
      {
        id: 'false-color',
        label: 'False Color',
        description: 'Based on bands 4,3,2',
        thumbnail:
          'https://cnet4.cbsistatic.com/img/-JKG69A9xmdlvxVwYtpIztVHxHI=/940x0/2018/08/21/09803db6-578f-41f7-9c7a-0b9efc5d6751/starshot-satellite-launch.jpg',
      },
      {
        id: 'true-color',
        label: 'True Color',
        description: 'Based on bands 4,3,2',
        thumbnail:
          'https://cnet4.cbsistatic.com/img/-JKG69A9xmdlvxVwYtpIztVHxHI=/940x0/2018/08/21/09803db6-578f-41f7-9c7a-0b9efc5d6751/starshot-satellite-launch.jpg',
      },
    ],
  },
  {
    id: 'gibs',
    label: 'GIBS',
    description: 'Some text describing the GIBS satellite',
    tiers: [
      {
        id: 'free',
        label: 'Free Images',
        description: 'Free scenes.',
      },
      {
        id: 'mid',
        label: 'Mid Resolution',
        description: 'Mid resolution scenes.',
      },
      {
        id: 'high',
        label: 'High Resolution',
        description: 'High resolution scenes.',
      },
    ],
    visualisations: [
      {
        id: 'ndvi',
        label: 'NDVI',
        description: 'Based on conbination bands (B8A-B4)/(B8A + B11)',
        thumbnail:
          'https://landsat-pds.s3.amazonaws.com/c1/L8/027/033/LC08_L1TP_027033_20200107_20200114_01_T1/LC08_L1TP_027033_20200107_20200114_01_T1_thumb_small.jpg',
      },
      {
        id: 'false-color-urban',
        label: 'False Color (urban)',
        description: 'Based on bands 4,3,2',
        thumbnail:
          'https://landsat-pds.s3.amazonaws.com/c1/L8/027/033/LC08_L1TP_027033_20200107_20200114_01_T1/LC08_L1TP_027033_20200107_20200114_01_T1_thumb_small.jpg',
      },
      {
        id: 'false-color',
        label: 'False Color',
        description: 'Based on bands 4,3,2',
        thumbnail:
          'https://landsat-pds.s3.amazonaws.com/c1/L8/027/033/LC08_L1TP_027033_20200107_20200114_01_T1/LC08_L1TP_027033_20200107_20200114_01_T1_thumb_small.jpg',
      },
      {
        id: 'true-color',
        label: 'True Color',
        description: 'Based on bands 4,3,2',
        thumbnail:
          'https://landsat-pds.s3.amazonaws.com/c1/L8/027/033/LC08_L1TP_027033_20200107_20200114_01_T1/LC08_L1TP_027033_20200107_20200114_01_T1_thumb_small.jpg',
      },
    ],
  },
];

const scenes = [
  {
    id: '32UVD',
    created: '2019-12-29T08:00:00Z',
    cloudCover: '4.23',
    download_url:
      'https://landsat-pds.s3.amazonaws.com/c1/L8/027/033/LC08_L1TP_027033_20200107_20200114_01_T1/LC08_L1TP_027033_20200107_20200114_01_T1_thumb_small.jpg',
    tier: 'free',
    metadata: {
      key: 'To be decided',
    },
    tile_url:
      'https://landsat-pds.s3.amazonaws.com/c1/L8/027/033/LC08_L1TP_027033_20190613_20190619_01_T1/LC08_L1TP_027033_20190613_20190619_01_T1_thumb_small.jpg',
    thumbnail_url:
      'https://landsat-pds.s3.amazonaws.com/c1/L8/027/033/LC08_L1TP_027033_20190613_20190619_01_T1/LC08_L1TP_027033_20190613_20190619_01_T1_thumb_small.jpg',
    satellite: 'sentinel-2',
  },
  {
    id: '323UVD',
    created: '2019-12-29T08:00:00Z',
    cloudCover: '6.23',
    download_url:
      'https://landsat-pds.s3.amazonaws.com/c1/L8/027/033/LC08_L1TP_027033_20200107_20200114_01_T1/LC08_L1TP_027033_20200107_20200114_01_T1_thumb_small.jpg',
    tier: 'mid-res',
    swath: 'Geometry object to be added',
    metadata: {
      key: 'To be decided',
    },
    tile_url:
      'https://landsat-pds.s3.amazonaws.com/c1/L8/027/033/LC08_L1TP_027033_20190613_20190619_01_T1/LC08_L1TP_027033_20190613_20190619_01_T1_thumb_small.jpg',
    thumbnail_url:
      'https://landsat-pds.s3.amazonaws.com/c1/L8/027/033/LC08_L1TP_027033_20190613_20190619_01_T1/LC08_L1TP_027033_20190613_20190619_01_T1_thumb_small.jpg',
    satellite: 'sentinel-2',
  },
  {
    id: '34UVD',
    created: '2019-12-29T08:00:00Z',
    cloudCover: '8.23',
    download_url:
      'https://landsat-pds.s3.amazonaws.com/c1/L8/027/033/LC08_L1TP_027033_20200107_20200114_01_T1/LC08_L1TP_027033_20200107_20200114_01_T1_thumb_small.jpg',
    tier: 'high-res',
    swath: 'Geometry object to be added',
    metadata: {
      key: 'To be decided',
    },
    tile_url:
      'https://landsat-pds.s3.amazonaws.com/c1/L8/027/033/LC08_L1TP_027033_20190613_20190619_01_T1/LC08_L1TP_027033_20190613_20190619_01_T1_thumb_small.jpg',
    thumbnail_url:
      'https://landsat-pds.s3.amazonaws.com/c1/L8/027/033/LC08_L1TP_027033_20190613_20190619_01_T1/LC08_L1TP_027033_20190613_20190619_01_T1_thumb_small.jpg',
    satellite: 'sentinel-2',
  },
  {
    id: '35UVD',
    created: '2019-12-29T08:00:00Z',
    cloudCover: '10.23',
    download_url:
      'https://landsat-pds.s3.amazonaws.com/c1/L8/027/033/LC08_L1TP_027033_20200107_20200114_01_T1/LC08_L1TP_027033_20200107_20200114_01_T1_thumb_small.jpg',
    tier: 'free',
    swath: 'Geometry object to be added',
    metadata: {
      key: 'To be decided',
    },
    tile_url:
      'https://landsat-pds.s3.amazonaws.com/c1/L8/027/033/LC08_L1TP_027033_20190613_20190619_01_T1/LC08_L1TP_027033_20190613_20190619_01_T1_thumb_small.jpg',
    thumbnail_url:
      'https://landsat-pds.s3.amazonaws.com/c1/L8/027/033/LC08_L1TP_027033_20190613_20190619_01_T1/LC08_L1TP_027033_20190613_20190619_01_T1_thumb_small.jpg',
    satellite: 'sentinel-2',
  },
  {
    id: '36UVD',
    created: '2019-12-29T08:00:00Z',
    cloudCover: '15.23',
    download_url:
      'https://landsat-pds.s3.amazonaws.com/c1/L8/027/033/LC08_L1TP_027033_20200107_20200114_01_T1/LC08_L1TP_027033_20200107_20200114_01_T1_thumb_small.jpg',
    tier: 'mid-res',
    swath: 'Geometry object to be added',
    metadata: {
      key: 'To be decided',
    },
    tile_url:
      'https://landsat-pds.s3.amazonaws.com/c1/L8/027/033/LC08_L1TP_027033_20190613_20190619_01_T1/LC08_L1TP_027033_20190613_20190619_01_T1_thumb_small.jpg',
    thumbnail_url:
      'https://landsat-pds.s3.amazonaws.com/c1/L8/027/033/LC08_L1TP_027033_20190613_20190619_01_T1/LC08_L1TP_027033_20190613_20190619_01_T1_thumb_small.jpg',
    satellite: 'sentinel-2',
  },
  {
    id: '37UVD',
    created: '2019-12-29T08:00:00Z',
    cloudCover: '20.23',
    download_url:
      'https://landsat-pds.s3.amazonaws.com/c1/L8/027/033/LC08_L1TP_027033_20200107_20200114_01_T1/LC08_L1TP_027033_20200107_20200114_01_T1_thumb_small.jpg',
    tier: 'high-res',
    swath: 'Geometry object to be added',
    metadata: {
      key: 'To be decided',
    },
    tile_url:
      'https://landsat-pds.s3.amazonaws.com/c1/L8/027/033/LC08_L1TP_027033_20190613_20190619_01_T1/LC08_L1TP_027033_20190613_20190619_01_T1_thumb_small.jpg',
    thumbnail_url:
      'https://landsat-pds.s3.amazonaws.com/c1/L8/027/033/LC08_L1TP_027033_20190613_20190619_01_T1/LC08_L1TP_027033_20190613_20190619_01_T1_thumb_small.jpg',
    satellite: 'sentinel-2',
  },
];

const selectedScene = {
  id: '32UVD',
  created: '2019-12-29T08:00:00Z',
  cloudCover: '4.23',
  download_url:
    'https://landsat-pds.s3.amazonaws.com/c1/L8/027/033/LC08_L1TP_027033_20200107_20200114_01_T1/LC08_L1TP_027033_20200107_20200114_01_T1_thumb_small.jpg',
  tier: 'free',
  metadata: {
    key: 'To be decided',
  },
  tile_url:
    'https://landsat-pds.s3.amazonaws.com/c1/L8/027/033/LC08_L1TP_027033_20190613_20190619_01_T1/LC08_L1TP_027033_20190613_20190619_01_T1_thumb_small.jpg',
  thumbnail_url:
    'https://landsat-pds.s3.amazonaws.com/c1/L8/027/033/LC08_L1TP_027033_20190613_20190619_01_T1/LC08_L1TP_027033_20190613_20190619_01_T1_thumb_small.jpg',
  satellite: 'sentinel-2',
};

describe.skip('Satellites', () => {
  let fetchPinnedScenes = null;

  beforeEach(() => {
    fetch.mockResponse(JSON.stringify([], { status: 200 }));

    fetchPinnedScenes = jest.fn();
  });

  describe('top navigation', () => {
    describe('has results and visualisation disabled when no search has been made', () => {
      let store;

      beforeEach(() => {
        store = mockStore({
          ...baseStore,
          satellites: { satellites, scenes: undefined, selectedScene: null },
        });
      });

      it('results', () => {
        const { getByText } = render(
          <Provider store={store}>
            <Satellites />
          </Provider>,
        );
        expect(getByText('Results')).toHaveProperty('disabled', true);
      });

      it('visualisation', () => {
        const { getByText } = render(
          <Provider store={store}>
            <Satellites />
          </Provider>,
        );
        expect(getByText('Visualisation')).toHaveProperty('disabled', true);
      });
    });

    it('has visualisation disabled when no scene has been selected', () => {
      const store = mockStore({
        ...baseStore,
        satellites: {
          scenes,
          selectedScene: null,
        },
      });
      const { getByText } = render(
        <Provider store={store}>
          <Satellites />
        </Provider>,
      );
      expect(getByText('Results')).toHaveProperty('disabled', false);
      expect(getByText('Visualisation')).toHaveProperty('disabled', true);
    });

    it('has free navigation when each step has been completed', () => {
      const store = mockStore({
        ...baseStore,
        satellites: { satellites, scenes, selectedScene },
      });
      const { getByText } = render(
        <Provider store={store}>
          <Satellites />
        </Provider>,
      );
      expect(getByText('Results')).toHaveProperty('disabled', false);
      expect(getByText('Visualisation')).toHaveProperty('disabled', false);
    });
  });
});
