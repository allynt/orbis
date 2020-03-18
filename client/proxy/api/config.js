('use strict');

const appConfig = {
  trackingId: 'UA-143753043-1',
  mapbox_token: 'pk.eyJ1IjoidGhlcm1jZXJ0IiwiYSI6ImNqbmN5N2F6NzBnODYza3A2anVqYWExOW8ifQ.10y0sH8cDQp9AfZNg1-M3Q',
  mapStyles: [
    { id: 'streets', uri: 'mapbox://styles/mapbox/streets-v11', title: 'Taking It To The Streets' },
    { id: 'light', uri: 'mapbox://styles/mapbox/light-v10', title: 'Light My Fire' },
    { id: 'dark', uri: 'mapbox://styles/mapbox/dark-v10', title: 'Dark Was The Night' },
    { id: 'satellite', uri: 'mapbox://styles/mapbox/satellite-v9', title: 'Satellite Of Love' }
  ],
  maximumAoiArea: 500
};

const userKey = { key: '57bd67287664bb1497cb29fe89d2d5087195a3ae' };

const users = [
  {
    id: 1,
    username: 'user@test.com',
    email: 'user@test.com',
    password: 'pandaconcretespoon',
    name: null,
    description: '',
    is_verified: true,
    is_approved: true,
    profiles: {},
    roles: [{ id: 2, name: 'IsUser', description: '', permissions: [] }]
  },
  {
    id: 2,
    username: 'admin@test.com',
    email: 'admin@test.com',
    password: 'pandaconcretespoon',
    name: null,
    description: '',
    is_verified: true,
    is_approved: true,
    profiles: {},
    roles: [
      { id: 1, name: 'IsManager', description: '', permissions: [] },
      { id: 2, name: 'IsUser', description: '', permissions: [] }
    ]
  },
  {
    id: 2,
    username: 'verified@test.com',
    email: 'verified@test.com',
    password: 'pandaconcretespoon',
    name: null,
    description: '',
    is_verified: true,
    is_approved: false,
    profiles: {},
    roles: [{ id: 2, name: 'IsUser', description: '', permissions: [] }]
  },
  {
    id: 3,
    username: 'approved@test.com',
    email: 'approved@test.com',
    password: 'pandaconcretespoon',
    name: null,
    description: '',
    is_verified: false,
    is_approved: true,
    profiles: {},
    roles: [{ id: 2, name: 'IsUser', description: '', permissions: [] }]
  }
];

const bookmarks = [
  {
    title: 'bookmark 1',
    feature_collection: [],
    center: [0, 0],
    zoom: 5,
    owner: users[2].id
  },
  {
    title: 'bookmark 2',
    feature_collection: [],
    center: [55.961667, -3.165556],
    zoom: 6,
    owner: users[2].id
  }
];

const sources = {
  token: 'sdfasdfasf',
  timeout: 60,
  sources: [
    {
      label: 'TropoSphere',
      layers: [
        {
          source_id: 'astrosat/core/hospitals-uk/2019-12-17',
          authority: 'astrosat',
          namespace: 'core',
          name: 'hospitals-uk',
          version: '2019-12-17',
          type: 'geojson', // vector|raster|geojson
          status: 'published', // draft|published|deprecated
          metadata: {
            label: 'UK Hospitals',
            domain: 'TropoSphere',
            range: true,
            description:
              'TropoSphere has name hospitals-uk with a label UK Hospitals Some paragraph describing stuff. TropoSphere has name hospitals-uk with a label UK Hospitals Some paragraph describing stuff.',
            url: 'https://staticdata.testing.or3is.com/astrosat/core/hospitals-uk/2019-12-17/hospitals_uk.geojson'
          }
        },
        {
          source_id: 'astrosat/test/sentinel_2_rgb/S2A_20191223T034141_T47NPG_RGB',
          authority: 'astrosat',
          namespace: 'test',
          name: 'sentinel-2-rgb',
          version: 'S2A_20191223T034141_T47NPG_RGB',
          type: 'raster', // vector|raster|geojson
          status: 'published', // draft|published|deprecated
          metadata: {
            label: 'Sentinel 2 RGB',
            domain: 'TropoSphere',
            range: true,
            description:
              'TropoSphere has name sentinel-2-rgb with a label Sentinel 2 RGB Some paragraph describing stuff.',
            url:
              'https://staticdata.testing.or3is.com/astrosat/test/sentinel_2_rgb/S2A_20191223T034141_T47NPG_RGB/{z}/{x}/{y}.png'
          }
        }
      ]
    },
    {
      label: 'Rice Paddies',
      layers: [
        {
          source_id: 'astrosat/test/stoke-on-trent/v1',
          authority: 'astrosat',
          namespace: 'test',
          name: 'stoke-on-trent',
          version: 'v1',
          type: 'vector', // vector|raster|geojson
          status: 'published', // draft|published|deprecated
          metadata: {
            label: 'Stoke-On-Trent',
            domain: 'Rice Paddies',
            range: true,
            description:
              'Rice Paddies has name stoke-on-trent with a label Stoke-On-Trent Some paragraph describing stuff',
            url: 'https://staticdata.testing.or3is.com/astrosat/test/stoke-on-trent/v1/{z}/{x}/{y}.pbf'
          }
        },
        {
          source_id: 'astrosat/test/super-sen2-japan-band5/dec-2019',
          authority: 'astrosat',
          namespace: 'test',
          name: 'super-sen2-japan-band',
          version: 'dec-2019',
          type: 'raster', // vector|raster|geojson
          status: 'published', // draft|published|deprecated
          metadata: {
            label: 'Japan Band5',
            domain: 'Rice Paddies',
            range: true,
            description:
              'Rice Paddies has name super-sen2-japan-band5 with a label Japan Band5 Some paragraph describing stuff.',
            url: 'https://staticdata.testing.or3is.com/astrosat/test/super-sen2-japan-band5/dec-2019/{z}/{x}/{y}.png'
          }
        }
      ]
    }
  ]
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
        description: 'Free scenes.'
      },
      {
        id: 'mid',
        label: 'Mid Resolution',
        description: 'Mid resolution scenes.'
      },
      {
        id: 'high',
        label: 'High Resolution',
        description: 'High resolution scenes.'
      }
    ],
    visualisations: [
      {
        id: 'true-color',
        label: 'True Color',
        description: 'Based on bands 4,3,2',
        thumbnail:
          'https://cnet4.cbsistatic.com/img/-JKG69A9xmdlvxVwYtpIztVHxHI=/940x0/2018/08/21/09803db6-578f-41f7-9c7a-0b9efc5d6751/starshot-satellite-launch.jpg'
      },
      {
        id: 'false-color',
        label: 'False Color',
        description: 'Based on bands 4,3,2',
        thumbnail:
          'https://cnet4.cbsistatic.com/img/-JKG69A9xmdlvxVwYtpIztVHxHI=/940x0/2018/08/21/09803db6-578f-41f7-9c7a-0b9efc5d6751/starshot-satellite-launch.jpg'
      },
      {
        id: 'false-color-urban',
        label: 'False Color (urban)',
        description: 'Based on bands 4,3,2',
        thumbnail:
          'https://cnet4.cbsistatic.com/img/-JKG69A9xmdlvxVwYtpIztVHxHI=/940x0/2018/08/21/09803db6-578f-41f7-9c7a-0b9efc5d6751/starshot-satellite-launch.jpg'
      },
      {
        id: 'ndvi',
        label: 'NDVI',
        description: 'Based on conbination bands (B8A-B4)/(B8A + B11)',
        thumbnail:
          'https://cnet4.cbsistatic.com/img/-JKG69A9xmdlvxVwYtpIztVHxHI=/940x0/2018/08/21/09803db6-578f-41f7-9c7a-0b9efc5d6751/starshot-satellite-launch.jpg'
      }
    ]
  },
  {
    id: 'sentinel-2',
    label: 'Sentinel-2',
    description: 'Some text describing the Sentinel-2 satellite.',
    tiers: [
      {
        id: 'free',
        label: 'Free Images',
        description: 'Free scenes.'
      },
      {
        id: 'mid',
        label: 'Mid Resolution',
        description: 'Mid resolution scenes.'
      },
      {
        id: 'high',
        label: 'High Resolution',
        description: 'High resolution scenes.'
      }
    ],
    visualisations: [
      {
        id: 'true-color',
        label: 'True Color',
        description: 'Based on bands 4,3,2',
        thumbnail:
          'https://cnet4.cbsistatic.com/img/-JKG69A9xmdlvxVwYtpIztVHxHI=/940x0/2018/08/21/09803db6-578f-41f7-9c7a-0b9efc5d6751/starshot-satellite-launch.jpg'
      },
      {
        id: 'false-color',
        label: 'False Color',
        description: 'Based on bands 4,3,2',
        thumbnail:
          'https://cnet4.cbsistatic.com/img/-JKG69A9xmdlvxVwYtpIztVHxHI=/940x0/2018/08/21/09803db6-578f-41f7-9c7a-0b9efc5d6751/starshot-satellite-launch.jpg'
      },
      {
        id: 'false-color-urban',
        label: 'False Color (urban)',
        description: 'Based on bands 4,3,2',
        thumbnail:
          'https://cnet4.cbsistatic.com/img/-JKG69A9xmdlvxVwYtpIztVHxHI=/940x0/2018/08/21/09803db6-578f-41f7-9c7a-0b9efc5d6751/starshot-satellite-launch.jpg'
      },
      {
        id: 'ndvi',
        label: 'NDVI',
        description: 'Based on conbination bands (B8A-B4)/(B8A + B11)',
        thumbnail:
          'https://cnet4.cbsistatic.com/img/-JKG69A9xmdlvxVwYtpIztVHxHI=/940x0/2018/08/21/09803db6-578f-41f7-9c7a-0b9efc5d6751/starshot-satellite-launch.jpg'
      }
    ]
  },
  {
    id: 'sentinel-3',
    label: 'Sentinel-3',
    description: 'Some text describing the Sentinel-3 satellite.',
    tiers: [
      {
        id: 'free',
        label: 'Free Images',
        description: 'Free scenes.'
      },
      {
        id: 'mid',
        label: 'Mid Resolution',
        description: 'Mid resolution scenes.'
      },
      {
        id: 'high',
        label: 'High Resolution',
        description: 'High resolution scenes.'
      }
    ],
    visualisations: [
      {
        id: 'true-color',
        label: 'True Color',
        description: 'Based on bands 4,3,2',
        thumbnail:
          'https://cnet4.cbsistatic.com/img/-JKG69A9xmdlvxVwYtpIztVHxHI=/940x0/2018/08/21/09803db6-578f-41f7-9c7a-0b9efc5d6751/starshot-satellite-launch.jpg'
      },
      {
        id: 'false-color',
        label: 'False Color',
        description: 'Based on bands 4,3,2',
        thumbnail:
          'https://cnet4.cbsistatic.com/img/-JKG69A9xmdlvxVwYtpIztVHxHI=/940x0/2018/08/21/09803db6-578f-41f7-9c7a-0b9efc5d6751/starshot-satellite-launch.jpg'
      },
      {
        id: 'false-color-urban',
        label: 'False Color (urban)',
        description: 'Based on bands 4,3,2',
        thumbnail:
          'https://cnet4.cbsistatic.com/img/-JKG69A9xmdlvxVwYtpIztVHxHI=/940x0/2018/08/21/09803db6-578f-41f7-9c7a-0b9efc5d6751/starshot-satellite-launch.jpg'
      },
      {
        id: 'ndvi',
        label: 'NDVI',
        description: 'Based on conbination bands (B8A-B4)/(B8A + B11)',
        thumbnail:
          'https://cnet4.cbsistatic.com/img/-JKG69A9xmdlvxVwYtpIztVHxHI=/940x0/2018/08/21/09803db6-578f-41f7-9c7a-0b9efc5d6751/starshot-satellite-launch.jpg'
      }
    ]
  },
  {
    id: 'landsat',
    label: 'Landsat',
    description: 'Some text describing the Landsat satellite',
    tiers: [
      {
        id: 'free',
        label: 'Free Images',
        description: 'Free scenes.'
      },
      {
        id: 'mid',
        label: 'Mid Resolution',
        description: 'Mid resolution scenes.'
      },
      {
        id: 'high',
        label: 'High Resolution',
        description: 'High resolution scenes.'
      }
    ],
    visualisations: [
      {
        id: 'ndvi',
        label: 'NDVI',
        description: 'Based on conbination bands (B8A-B4)/(B8A + B11)',
        thumbnail:
          'https://cnet4.cbsistatic.com/img/-JKG69A9xmdlvxVwYtpIztVHxHI=/940x0/2018/08/21/09803db6-578f-41f7-9c7a-0b9efc5d6751/starshot-satellite-launch.jpg'
      },
      {
        id: 'false-color-urban',
        label: 'False Color (urban)',
        description: 'Based on bands 4,3,2',
        thumbnail:
          'https://cnet4.cbsistatic.com/img/-JKG69A9xmdlvxVwYtpIztVHxHI=/940x0/2018/08/21/09803db6-578f-41f7-9c7a-0b9efc5d6751/starshot-satellite-launch.jpg'
      },
      {
        id: 'false-color',
        label: 'False Color',
        description: 'Based on bands 4,3,2',
        thumbnail:
          'https://cnet4.cbsistatic.com/img/-JKG69A9xmdlvxVwYtpIztVHxHI=/940x0/2018/08/21/09803db6-578f-41f7-9c7a-0b9efc5d6751/starshot-satellite-launch.jpg'
      },
      {
        id: 'true-color',
        label: 'True Color',
        description: 'Based on bands 4,3,2',
        thumbnail:
          'https://cnet4.cbsistatic.com/img/-JKG69A9xmdlvxVwYtpIztVHxHI=/940x0/2018/08/21/09803db6-578f-41f7-9c7a-0b9efc5d6751/starshot-satellite-launch.jpg'
      }
    ]
  },
  {
    id: 'envisat-meris',
    label: 'Envisat Meris',
    description: 'Some text describing the Envisat Meris satellite',
    tiers: [
      {
        id: 'free',
        label: 'Free Images',
        description: 'Free scenes.'
      },
      {
        id: 'mid',
        label: 'Mid Resolution',
        description: 'Mid resolution scenes.'
      },
      {
        id: 'high',
        label: 'High Resolution',
        description: 'High resolution scenes.'
      }
    ],
    visualisations: [
      {
        id: 'ndvi',
        label: 'NDVI',
        description: 'Based on conbination bands (B8A-B4)/(B8A + B11)',
        thumbnail:
          'https://cnet4.cbsistatic.com/img/-JKG69A9xmdlvxVwYtpIztVHxHI=/940x0/2018/08/21/09803db6-578f-41f7-9c7a-0b9efc5d6751/starshot-satellite-launch.jpg'
      },
      {
        id: 'false-color-urban',
        label: 'False Color (urban)',
        description: 'Based on bands 4,3,2',
        thumbnail:
          'https://cnet4.cbsistatic.com/img/-JKG69A9xmdlvxVwYtpIztVHxHI=/940x0/2018/08/21/09803db6-578f-41f7-9c7a-0b9efc5d6751/starshot-satellite-launch.jpg'
      },
      {
        id: 'false-color',
        label: 'False Color',
        description: 'Based on bands 4,3,2',
        thumbnail:
          'https://cnet4.cbsistatic.com/img/-JKG69A9xmdlvxVwYtpIztVHxHI=/940x0/2018/08/21/09803db6-578f-41f7-9c7a-0b9efc5d6751/starshot-satellite-launch.jpg'
      },
      {
        id: 'true-color',
        label: 'True Color',
        description: 'Based on bands 4,3,2',
        thumbnail:
          'https://cnet4.cbsistatic.com/img/-JKG69A9xmdlvxVwYtpIztVHxHI=/940x0/2018/08/21/09803db6-578f-41f7-9c7a-0b9efc5d6751/starshot-satellite-launch.jpg'
      }
    ]
  },
  {
    id: 'modis',
    label: 'MODIS',
    description: 'Some text describing the MODIS satellite',
    tiers: [
      {
        id: 'free',
        label: 'Free Images',
        description: 'Free scenes.'
      },
      {
        id: 'mid',
        label: 'Mid Resolution',
        description: 'Mid resolution scenes.'
      },
      {
        id: 'high',
        label: 'High Resolution',
        description: 'High resolution scenes.'
      }
    ],
    visualisations: [
      {
        id: 'ndvi',
        label: 'ndvi',
        description: 'This is a description of this visualization',
        thumbnail:
          'https://landsat-pds.s3.amazonaws.com/c1/L8/027/033/LC08_L1TP_027033_20200107_20200114_01_T1/LC08_L1TP_027033_20200107_20200114_01_T1_thumb_small.jpg'
      }
    ]
  },
  {
    id: 'proba-v',
    label: 'Proba-V',
    description: 'Some text describing the Proba-V satellite',
    tiers: [
      {
        id: 'free',
        label: 'Free Images',
        description: 'Free scenes.'
      },
      {
        id: 'mid',
        label: 'Mid Resolution',
        description: 'Mid resolution scenes.'
      },
      {
        id: 'high',
        label: 'High Resolution',
        description: 'High resolution scenes.'
      }
    ],
    visualisations: [
      {
        id: 'ndvi',
        label: 'NDVI',
        description: 'Based on conbination bands (B8A-B4)/(B8A + B11)',
        thumbnail:
          'https://cnet4.cbsistatic.com/img/-JKG69A9xmdlvxVwYtpIztVHxHI=/940x0/2018/08/21/09803db6-578f-41f7-9c7a-0b9efc5d6751/starshot-satellite-launch.jpg'
      },
      {
        id: 'false-color-urban',
        label: 'False Color (urban)',
        description: 'Based on bands 4,3,2',
        thumbnail:
          'https://cnet4.cbsistatic.com/img/-JKG69A9xmdlvxVwYtpIztVHxHI=/940x0/2018/08/21/09803db6-578f-41f7-9c7a-0b9efc5d6751/starshot-satellite-launch.jpg'
      },
      {
        id: 'false-color',
        label: 'False Color',
        description: 'Based on bands 4,3,2',
        thumbnail:
          'https://cnet4.cbsistatic.com/img/-JKG69A9xmdlvxVwYtpIztVHxHI=/940x0/2018/08/21/09803db6-578f-41f7-9c7a-0b9efc5d6751/starshot-satellite-launch.jpg'
      },
      {
        id: 'true-color',
        label: 'True Color',
        description: 'Based on bands 4,3,2',
        thumbnail:
          'https://cnet4.cbsistatic.com/img/-JKG69A9xmdlvxVwYtpIztVHxHI=/940x0/2018/08/21/09803db6-578f-41f7-9c7a-0b9efc5d6751/starshot-satellite-launch.jpg'
      }
    ]
  },
  {
    id: 'gibs',
    label: 'GIBS',
    description: 'Some text describing the GIBS satellite',
    tiers: [
      {
        id: 'free',
        label: 'Free Images',
        description: 'Free scenes.'
      },
      {
        id: 'mid',
        label: 'Mid Resolution',
        description: 'Mid resolution scenes.'
      },
      {
        id: 'high',
        label: 'High Resolution',
        description: 'High resolution scenes.'
      }
    ],
    visualisations: [
      {
        id: 'ndvi',
        label: 'NDVI',
        description: 'Based on conbination bands (B8A-B4)/(B8A + B11)',
        thumbnail:
          'https://landsat-pds.s3.amazonaws.com/c1/L8/027/033/LC08_L1TP_027033_20200107_20200114_01_T1/LC08_L1TP_027033_20200107_20200114_01_T1_thumb_small.jpg'
      },
      {
        id: 'false-color-urban',
        label: 'False Color (urban)',
        description: 'Based on bands 4,3,2',
        thumbnail:
          'https://landsat-pds.s3.amazonaws.com/c1/L8/027/033/LC08_L1TP_027033_20200107_20200114_01_T1/LC08_L1TP_027033_20200107_20200114_01_T1_thumb_small.jpg'
      },
      {
        id: 'false-color',
        label: 'False Color',
        description: 'Based on bands 4,3,2',
        thumbnail:
          'https://landsat-pds.s3.amazonaws.com/c1/L8/027/033/LC08_L1TP_027033_20200107_20200114_01_T1/LC08_L1TP_027033_20200107_20200114_01_T1_thumb_small.jpg'
      },
      {
        id: 'true-color',
        label: 'True Color',
        description: 'Based on bands 4,3,2',
        thumbnail:
          'https://landsat-pds.s3.amazonaws.com/c1/L8/027/033/LC08_L1TP_027033_20200107_20200114_01_T1/LC08_L1TP_027033_20200107_20200114_01_T1_thumb_small.jpg'
      }
    ]
  }
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
      [-4.570311, 12.757874],
      [7.119142, 13.197327],
      [5.888673, 9.066467],
      [-0.263671, 9.242249],
      [-0.263671, 9.242249],
      [-4.570311, 12.757874]
    ],
    owner: 1,
    created: '2020-03-02T10:00:18.622754Z'
  },
  {
    id: 2,
    name: 'Sentinel-2',
    satellites: ['sentinel-2'],
    tiers: ['mid'],
    start_date: '06-15-2016',
    end_date: '02-12-2016',
    aoi: [
      [-4.570311, 12.757874],
      [7.119142, 13.197327],
      [5.888673, 9.066467],
      [-0.263671, 9.242249],
      [-0.263671, 9.242249],
      [-4.570311, 12.757874]
    ],
    owner: 1,
    created: '2020-03-02T10:00:18.622754Z'
  },
  {
    id: 1,
    name: 'MODIS',
    satellites: ['modis'],
    tiers: ['high'],
    start_date: '05-19-2017',
    end_date: '12-30-2017',
    aoi: [
      [-4.570311, 12.757874],
      [7.119142, 13.197327],
      [5.888673, 9.066467],
      [-0.263671, 9.242249],
      [-0.263671, 9.242249],
      [-4.570311, 12.757874]
    ],
    owner: 1,
    created: '2020-03-02T10:00:18.622754Z'
  }
];

const satelliteScenes = [
  {
    id: '32UVD',
    created: '2019-12-29T08:00:00Z',
    cloudCover: '4.23',
    download_url:
      'https://landsat-pds.s3.amazonaws.com/c1/L8/027/033/LC08_L1TP_027033_20200107_20200114_01_T1/LC08_L1TP_027033_20200107_20200114_01_T1_thumb_small.jpg',
    tier: 'free',
    metadata: { key: 'To be decided' },
    tile_url:
      'https://landsat-pds.s3.amazonaws.com/c1/L8/027/033/LC08_L1TP_027033_20190613_20190619_01_T1/LC08_L1TP_027033_20190613_20190619_01_T1_thumb_small.jpg',

    thumbnail_url:
      'https://landsat-pds.s3.amazonaws.com/c1/L8/027/033/LC08_L1TP_027033_20190613_20190619_01_T1/LC08_L1TP_027033_20190613_20190619_01_T1_thumb_small.jpg',
    satellite: 'sentinel-2'
  },
  {
    id: '323UVD',
    created: '2019-12-29T08:00:00Z',
    cloudCover: '6.23',
    download_url:
      'https://landsat-pds.s3.amazonaws.com/c1/L8/027/033/LC08_L1TP_027033_20200107_20200114_01_T1/LC08_L1TP_027033_20200107_20200114_01_T1_thumb_small.jpg',
    tier: 'mid-res',
    swath: 'Geometry object to be added',
    metadata: { key: 'To be decided' },
    tile_url:
      'https://landsat-pds.s3.amazonaws.com/c1/L8/027/033/LC08_L1TP_027033_20190613_20190619_01_T1/LC08_L1TP_027033_20190613_20190619_01_T1_thumb_small.jpg',

    thumbnail_url:
      'https://landsat-pds.s3.amazonaws.com/c1/L8/027/033/LC08_L1TP_027033_20190613_20190619_01_T1/LC08_L1TP_027033_20190613_20190619_01_T1_thumb_small.jpg',
    satellite: 'sentinel-2'
  },
  {
    id: '34UVD',
    created: '2019-12-29T08:00:00Z',
    cloudCover: '8.23',
    download_url:
      'https://landsat-pds.s3.amazonaws.com/c1/L8/027/033/LC08_L1TP_027033_20200107_20200114_01_T1/LC08_L1TP_027033_20200107_20200114_01_T1_thumb_small.jpg',
    tier: 'high-res',
    swath: 'Geometry object to be added',
    metadata: { key: 'To be decided' },
    tile_url:
      'https://landsat-pds.s3.amazonaws.com/c1/L8/027/033/LC08_L1TP_027033_20190613_20190619_01_T1/LC08_L1TP_027033_20190613_20190619_01_T1_thumb_small.jpg',
    thumbnail_url:
      'https://landsat-pds.s3.amazonaws.com/c1/L8/027/033/LC08_L1TP_027033_20190613_20190619_01_T1/LC08_L1TP_027033_20190613_20190619_01_T1_thumb_small.jpg',
    satellite: 'sentinel-2'
  },
  {
    id: '35UVD',
    created: '2019-12-29T08:00:00Z',
    cloudCover: '10.23',
    download_url:
      'https://landsat-pds.s3.amazonaws.com/c1/L8/027/033/LC08_L1TP_027033_20200107_20200114_01_T1/LC08_L1TP_027033_20200107_20200114_01_T1_thumb_small.jpg',
    tier: 'free',
    swath: 'Geometry object to be added',
    metadata: { key: 'To be decided' },
    tile_url:
      'https://landsat-pds.s3.amazonaws.com/c1/L8/027/033/LC08_L1TP_027033_20190613_20190619_01_T1/LC08_L1TP_027033_20190613_20190619_01_T1_thumb_small.jpg',
    thumbnail_url:
      'https://landsat-pds.s3.amazonaws.com/c1/L8/027/033/LC08_L1TP_027033_20190613_20190619_01_T1/LC08_L1TP_027033_20190613_20190619_01_T1_thumb_small.jpg',
    satellite: 'sentinel-2'
  },
  {
    id: '36UVD',
    created: '2019-12-29T08:00:00Z',
    cloudCover: '15.23',
    download_url:
      'https://landsat-pds.s3.amazonaws.com/c1/L8/027/033/LC08_L1TP_027033_20200107_20200114_01_T1/LC08_L1TP_027033_20200107_20200114_01_T1_thumb_small.jpg',
    tier: 'mid-res',
    swath: 'Geometry object to be added',
    metadata: { key: 'To be decided' },
    tile_url:
      'https://landsat-pds.s3.amazonaws.com/c1/L8/027/033/LC08_L1TP_027033_20190613_20190619_01_T1/LC08_L1TP_027033_20190613_20190619_01_T1_thumb_small.jpg',
    thumbnail_url:
      'https://landsat-pds.s3.amazonaws.com/c1/L8/027/033/LC08_L1TP_027033_20190613_20190619_01_T1/LC08_L1TP_027033_20190613_20190619_01_T1_thumb_small.jpg',
    satellite: 'sentinel-2'
  },
  {
    id: '37UVD',
    created: '2019-12-29T08:00:00Z',
    cloudCover: '20.23',
    download_url:
      'https://landsat-pds.s3.amazonaws.com/c1/L8/027/033/LC08_L1TP_027033_20200107_20200114_01_T1/LC08_L1TP_027033_20200107_20200114_01_T1_thumb_small.jpg',
    tier: 'high-res',
    swath: 'Geometry object to be added',
    metadata: { key: 'To be decided' },
    tile_url:
      'https://landsat-pds.s3.amazonaws.com/c1/L8/027/033/LC08_L1TP_027033_20190613_20190619_01_T1/LC08_L1TP_027033_20190613_20190619_01_T1_thumb_small.jpg',
    thumbnail_url:
      'https://landsat-pds.s3.amazonaws.com/c1/L8/027/033/LC08_L1TP_027033_20190613_20190619_01_T1/LC08_L1TP_027033_20190613_20190619_01_T1_thumb_small.jpg',
    satellite: 'sentinel-2'
  }
];

let pinnedScenes = [
  {
    id: '32UVD',
    created: '2019-12-29T08:00:00Z',
    cloudCover: '4.23',
    download_url:
      'https://landsat-pds.s3.amazonaws.com/c1/L8/027/033/LC08_L1TP_027033_20200107_20200114_01_T1/LC08_L1TP_027033_20200107_20200114_01_T1_thumb_small.jpg',
    tier: 'free',
    metadata: { key: 'To be decided' },
    tile_url:
      'https://landsat-pds.s3.amazonaws.com/c1/L8/027/033/LC08_L1TP_027033_20190613_20190619_01_T1/LC08_L1TP_027033_20190613_20190619_01_T1_thumb_small.jpg',

    thumbnail_url:
      'https://landsat-pds.s3.amazonaws.com/c1/L8/027/033/LC08_L1TP_027033_20190613_20190619_01_T1/LC08_L1TP_027033_20190613_20190619_01_T1_thumb_small.jpg',
    satellite: 'sentinel-2'
  },
  {
    id: '35UVD',
    created: '2019-12-29T08:00:00Z',
    cloudCover: '10.23',
    download_url:
      'https://landsat-pds.s3.amazonaws.com/c1/L8/027/033/LC08_L1TP_027033_20200107_20200114_01_T1/LC08_L1TP_027033_20200107_20200114_01_T1_thumb_small.jpg',
    tier: 'free',
    swath: 'Geometry object to be added',
    metadata: { key: 'To be decided' },
    tile_url:
      'https://landsat-pds.s3.amazonaws.com/c1/L8/027/033/LC08_L1TP_027033_20190613_20190619_01_T1/LC08_L1TP_027033_20190613_20190619_01_T1_thumb_small.jpg',
    thumbnail_url:
      'https://landsat-pds.s3.amazonaws.com/c1/L8/027/033/LC08_L1TP_027033_20190613_20190619_01_T1/LC08_L1TP_027033_20190613_20190619_01_T1_thumb_small.jpg',
    satellite: 'sentinel-2'
  },
  {
    id: '37UVD',
    created: '2019-12-29T08:00:00Z',
    cloudCover: '20.23',
    download_url:
      'https://landsat-pds.s3.amazonaws.com/c1/L8/027/033/LC08_L1TP_027033_20200107_20200114_01_T1/LC08_L1TP_027033_20200107_20200114_01_T1_thumb_small.jpg',
    tier: 'high-res',
    swath: 'Geometry object to be added',
    metadata: { key: 'To be decided' },
    tile_url:
      'https://landsat-pds.s3.amazonaws.com/c1/L8/027/033/LC08_L1TP_027033_20190613_20190619_01_T1/LC08_L1TP_027033_20190613_20190619_01_T1_thumb_small.jpg',
    thumbnail_url:
      'https://landsat-pds.s3.amazonaws.com/c1/L8/027/033/LC08_L1TP_027033_20190613_20190619_01_T1/LC08_L1TP_027033_20190613_20190619_01_T1_thumb_small.jpg',
    satellite: 'sentinel-2'
  }
];

let currentUser = null;

const getAppConfig = (req, res) => {
  console.log('Returning App Config');
  res.status(200);
  res.json(appConfig);
};

const getUsers = (req, res) => {
  console.log('Returning All Users');
  res.status(200);
  res.json(users);
};

const getCurrentUser = (req, res) => {
  console.log('Returning Current User');
  res.status(200);
  res.json(currentUser);
};

const getSatellites = (req, res) => {
  console.log('Returning Satellites');
  res.status(200);
  res.json(satellites);
};

const register = (req, res) => {
  const details = req.body;
  console.log('Registering User: ', details);

  const existingUser = users.find(user => user.username === details.username);

  if (existingUser) {
    res.status(400);
    res.json({ message: `Sorry, ${details.username} already exists` });
  } else {
    let oldId = users.length;
    const user = {
      id: ++oldId,
      username: details.username,
      email: details.email,
      name: null,
      description: '',
      is_verified: false,
      is_approved: false,
      profiles: {},
      roles: []
    };

    users.push(user);

    res.status(200);
    res.json(userKey);
  }
};

const login = (req, res) => {
  const user = req.body;
  console.log('Logging User: ', user);

  currentUser = users.find(usr => usr.email === user.email);
  console.log('USER Matched: ', currentUser);

  if (currentUser) {
    if (!currentUser.is_approved) {
      res.status(400);
      res.json({ message: `Sorry, Registration not approved, please ask your manager to approve this account` });
    }

    if (!currentUser.is_verified) {
      res.status(400);
      res.json({ message: `Sorry, Registration not verified, please ask your manager to approve this account` });
    }

    if (user.password === currentUser.password) {
      res.status(200);
      res.json(userKey);
    } else {
      res.status(400);
      res.json({
        message:
          '<p>Sorry, email and password did not match.</p><p><strong>Warning:</strong> After 7 consecutive unsuccessful login attempts, your account will be locked out for 60 minutes.</p>'
      });
    }
  } else {
    res.status(400);
    res.json({ message: `Sorry, ${user.username} could not be found` });
  }
};

const logout = (req, res) => {
  console.log('User Logout');
  currentUser = null;

  res.status(200);
  res.json(userKey);
};

const getBookmarks = (req, res) => {
  console.log('Returning Bookmarks');
  const userBookmarks = bookmarks.filter(bookmark => bookmark.owner === currentUser.id);

  res.status(200);
  res.json(userBookmarks);
};

const addBookmark = (req, res) => {
  console.log('Adding Bookmark');
  const bookmark = {
    ...req.body
  };

  bookmarks.push(bookmark);

  res.status(200);
  res.json(bookmark);
};

const changePassword = (req, res) => {
  console.log(`Changing User Password`);
  const oldPassword = req.body.old_password;
  const newPassword = req.body.old_password;
  console.log(`Changing User Password from ${oldPassword} to ${newPassword}`);
  const user = users.find(user => user.username === currentUser.username);

  if (currentUser.password === oldPassword) {
    if (req.body.new_password1 === 'razorpelicanturf') {
      res.status(400);
      res.json({ message: 'Some Error' });
    } else {
      user.password = newPassword;
      currentUser.password = newPassword;

      res.status(200);
      res.json(user);
    }
  }
};

const getSources = (req, res) => {
  res.status(200);
  res.json(sources);
};

const getSatelliteSearches = (req, res) => {
  res.status(200);
  res.json(savedSatelliteSearches);
};

const saveSatelliteSearch = (req, res) => {
  const searches = [...savedSatelliteSearches, req.body];
  res.status(200);
  res.json(searches);
};

const deleteSatelliteSearch = (req, res) => {
  savedSatelliteSearches = savedSatelliteSearches.filter(sat => sat.id !== parseInt(req.params.id, 10));
  res.status(200);
  res.json(savedSatelliteSearches);
};

const searchSatelliteScenes = (req, res) => {
  console.log('Returning search results');
  res.status(200);
  res.json(satelliteScenes);
};

const getPinnedScenes = (req, res) => {
  console.log('Returning Pinned Scenes');
  res.status(200);
  res.json(pinnedScenes);
};

const pinScene = (req, res) => {
  pinnedScenes = [...pinnedScenes, req.body];
  res.status(200);
  res.json(pinnedScenes);
};

const deletePinnedScene = (req, res) => {
  pinnedScenes = pinnedScenes.filter(scene => scene.id !== req.params.id);
  res.status(200);
  res.json(pinnedScenes);
};

module.exports = {
  getAppConfig,
  getUsers,
  getCurrentUser,
  getSatellites,
  searchSatelliteScenes,
  register,
  login,
  logout,
  getBookmarks,
  addBookmark,
  changePassword,
  getSources,
  getSatelliteSearches,
  saveSatelliteSearch,
  deleteSatelliteSearch,
  getPinnedScenes,
  pinScene,
  deletePinnedScene
};
