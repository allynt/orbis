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

const satelliteScenes = [
  {
    id: '32UVD',
    created: '2019-12-29T08:00:00Z',
    cloudCover: '4.23',
    download_url:
      'https://landsat-pds.s3.amazonaws.com/c1/L8/027/033/LC08_L1TP_027033_20200107_20200114_01_T1/LC08_L1TP_027033_20200107_20200114_01_T1_thumb_small.jpg',
    tier: 'free',
    metadata: {
      summary: {
        date: '2016-12-07T10:54:32.026Z',
        instrument: 'MSI',
        mode: 'INS-NOBS',
        satellite: 'Sentinel-2',
        size: '736.49 MB',
      },
      name_of_instrument: 'Multi-Spectral Instrument',
      operational_mode_of_sensor: 'INS-NOBS',
      orbit_direction: 'DESCENDING',
      product_type: 'S2MSI1C',
      cloud_coverage: 97.5818,
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
      summary: {
        date: '2016-12-07T10:54:32.026Z',
        instrument: 'MSI',
        mode: 'INS-NOBS',
        satellite: 'Sentinel-2',
        size: '736.49 MB',
      },
      name_of_instrument: 'Multi-Spectral Instrument',
      operational_mode_of_sensor: 'INS-NOBS',
      orbit_direction: 'DESCENDING',
      product_type: 'S2MSI1C',
      cloud_coverage: 97.5818,
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
      summary: {
        date: '2016-12-07T10:54:32.026Z',
        instrument: 'MSI',
        mode: 'INS-NOBS',
        satellite: 'Sentinel-2',
        size: '736.49 MB',
      },
      name_of_instrument: 'Multi-Spectral Instrument',
      operational_mode_of_sensor: 'INS-NOBS',
      orbit_direction: 'DESCENDING',
      product_type: 'S2MSI1C',
      cloud_coverage: 97.5818,
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
      summary: {
        date: '2016-12-07T10:54:32.026Z',
        instrument: 'MSI',
        mode: 'INS-NOBS',
        satellite: 'Sentinel-2',
        size: '736.49 MB',
      },
      name_of_instrument: 'Multi-Spectral Instrument',
      operational_mode_of_sensor: 'INS-NOBS',
      orbit_direction: 'DESCENDING',
      product_type: 'S2MSI1C',
      cloud_coverage: 97.5818,
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
      summary: {
        date: '2016-12-07T10:54:32.026Z',
        instrument: 'MSI',
        mode: 'INS-NOBS',
        satellite: 'Sentinel-2',
        size: '736.49 MB',
      },
      name_of_instrument: 'Multi-Spectral Instrument',
      operational_mode_of_sensor: 'INS-NOBS',
      orbit_direction: 'DESCENDING',
      product_type: 'S2MSI1C',
      cloud_coverage: 97.5818,
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
      summary: {
        date: '2016-12-07T10:54:32.026Z',
        instrument: 'MSI',
        mode: 'INS-NOBS',
        satellite: 'Sentinel-2',
        size: '736.49 MB',
      },
      name_of_instrument: 'Multi-Spectral Instrument',
      operational_mode_of_sensor: 'INS-NOBS',
      orbit_direction: 'DESCENDING',
      product_type: 'S2MSI1C',
      cloud_coverage: 97.5818,
    },
    tile_url:
      'https://landsat-pds.s3.amazonaws.com/c1/L8/027/033/LC08_L1TP_027033_20190613_20190619_01_T1/LC08_L1TP_027033_20190613_20190619_01_T1_thumb_small.jpg',
    thumbnail_url:
      'https://landsat-pds.s3.amazonaws.com/c1/L8/027/033/LC08_L1TP_027033_20190613_20190619_01_T1/LC08_L1TP_027033_20190613_20190619_01_T1_thumb_small.jpg',
    satellite: 'sentinel-2',
  },
];

let savedSatelliteSearches = [
  {
    id: 1,
    name: 'NASA Landsat',
    satellites: ['landsat'],
    tiers: ['free'],
    start_date: '09-22-2018',
    end_date: '11-14-2018',
    aoi: [
      [-3.167660760641553, 55.99286861572247],
      [-2.903923859716656, 55.99286861572247],
      [-2.903923859716656, 55.845904872061936],
      [-3.167660760641553, 55.845904872061936],
      [-3.167660760641553, 55.99286861572247],
    ],
    owner: 1,
    created: '2020-03-02T10:00:18.622754Z',
  },
  {
    id: 2,
    name: 'Sentinel-2',
    satellites: ['sentinel-2'],
    tiers: ['mid'],
    start_date: '06-15-2016',
    end_date: '02-12-2016',
    aoi: [
      [-3.167660760641553, 55.99286861572247],
      [-2.903923859716656, 55.99286861572247],
      [-2.903923859716656, 55.845904872061936],
      [-3.167660760641553, 55.845904872061936],
      [-3.167660760641553, 55.99286861572247],
    ],
    owner: 1,
    created: '2020-03-02T10:00:18.622754Z',
  },
  {
    id: 1,
    name: 'MODIS',
    satellites: ['modis'],
    tiers: ['high'],
    start_date: '05-19-2017',
    end_date: '12-30-2017',
    aoi: [
      [-3.167660760641553, 55.99286861572247],
      [-2.903923859716656, 55.99286861572247],
      [-2.903923859716656, 55.845904872061936],
      [-3.167660760641553, 55.845904872061936],
      [-3.167660760641553, 55.99286861572247],
    ],
    owner: 1,
    created: '2020-03-02T10:00:18.622754Z',
  },
];

let pinnedScenes = [
  {
    id: '32UVD',
    created: '2019-12-29T08:00:00Z',
    cloudCover: '4.23',
    download_url:
      'https://landsat-pds.s3.amazonaws.com/c1/L8/027/033/LC08_L1TP_027033_20200107_20200114_01_T1/LC08_L1TP_027033_20200107_20200114_01_T1_thumb_small.jpg',
    tier: 'free',
    metadata: {
      summary: {
        date: '2016-12-07T10:54:32.026Z',
        instrument: 'MSI',
        mode: 'INS-NOBS',
        satellite: 'Sentinel-2',
        size: '736.49 MB',
      },
      name_of_instrument: 'Multi-Spectral Instrument',
      operational_mode_of_sensor: 'INS-NOBS',
      orbit_direction: 'DESCENDING',
      product_type: 'S2MSI1C',
      cloud_coverage: 97.5818,
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
      summary: {
        date: '2016-12-07T10:54:32.026Z',
        instrument: 'MSI',
        mode: 'INS-NOBS',
        satellite: 'Sentinel-2',
        size: '736.49 MB',
      },
      name_of_instrument: 'Multi-Spectral Instrument',
      operational_mode_of_sensor: 'INS-NOBS',
      orbit_direction: 'DESCENDING',
      product_type: 'S2MSI1C',
      cloud_coverage: 97.5818,
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
      summary: {
        date: '2016-12-07T10:54:32.026Z',
        instrument: 'MSI',
        mode: 'INS-NOBS',
        satellite: 'Sentinel-2',
        size: '736.49 MB',
      },
      name_of_instrument: 'Multi-Spectral Instrument',
      operational_mode_of_sensor: 'INS-NOBS',
      orbit_direction: 'DESCENDING',
      product_type: 'S2MSI1C',
      cloud_coverage: 97.5818,
    },
    tile_url:
      'https://landsat-pds.s3.amazonaws.com/c1/L8/027/033/LC08_L1TP_027033_20190613_20190619_01_T1/LC08_L1TP_027033_20190613_20190619_01_T1_thumb_small.jpg',
    thumbnail_url:
      'https://landsat-pds.s3.amazonaws.com/c1/L8/027/033/LC08_L1TP_027033_20190613_20190619_01_T1/LC08_L1TP_027033_20190613_20190619_01_T1_thumb_small.jpg',
    satellite: 'sentinel-2',
  },
];

const saveSatelliteSearch = satellite => {
  savedSatelliteSearches = [...savedSatelliteSearches, satellite];
};

export {
  satellites,
  satelliteScenes,
  savedSatelliteSearches,
  saveSatelliteSearch,
  pinnedScenes,
};
