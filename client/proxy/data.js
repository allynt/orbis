('use strict');

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

let bookmarks = [
  {
    id: 8,
    owner: 1,
    title: 'Scotland',
    description: 'This is a description paragraph that describes the contents of this bookmark.',
    created: '2020-01-31T12:01:22.640053Z',
    zoom: 6.61084694352591,
    center: [-5.205274, 57.178733],
    feature_collection: { type: 'FeatureCollection', features: [] },
    thumbnail: 'https://www.undiscoveredscotland.co.uk/usscotfax/geography/images/geography-450.jpg'
  },
  {
    id: 7,
    owner: 1,
    title: 'Guatemala',
    description: 'This is a description paragraph that describes the contents of this bookmark.',
    created: '2020-01-31T11:52:09.571808Z',
    zoom: 5.23484291387757,
    center: [-86.87191, 17.438782],
    feature_collection: { type: 'FeatureCollection', features: [] },
    thumbnail: 'https://cdn.mos.cms.futurecdn.net/PuMd7Vw3wsZafT27T2xWtF.jpg'
  },
  {
    id: 6,
    owner: 1,
    title: 'Vietnam',
    description: 'This is a description paragraph that describes the contents of this bookmark.',
    created: '2020-01-31T11:46:12.618090Z',
    zoom: 7.1319501464789,
    center: [108.312151, 20.053918],
    feature_collection: { type: 'FeatureCollection', features: [] },
    thumbnail: 'https://spacewatch.global/wp-content/uploads/2019/10/Vietnam.A2002092.0330.500m.jpg'
  },
  {
    id: 5,
    owner: 1,
    title: 'Malaysia',
    description: 'This is a description paragraph that describes the contents of this bookmark.',
    created: '2020-01-31T11:44:25.398622Z',
    zoom: 9.32646036279396,
    center: [100.616221, 5.804306],
    feature_collection: { type: 'FeatureCollection', features: [] },
    thumbnail:
      'https://s3.amazonaws.com/images.spaceref.com/news/2018/esa_earth_from_space_shanghai_china_071318_945.jpg'
  }
];

const sources = {
  token: 'sdfasdfasf',
  timeout: 60,
  sources: [
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
        description: 'TropoSphere has name sentinel-2-rgb with a label Sentinel 2 RGB Some paragraph describing stuff.',
        url:
          'https://staticdata.testing.or3is.com/astrosat/test/sentinel_2_rgb/S2A_20191223T034141_T47NPG_RGB/{z}/{x}/{y}.png'
      }
    },
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
        description: 'Rice Paddies has name stoke-on-trent with a label Stoke-On-Trent Some paragraph describing stuff',
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
    },
    {
      name: 'population-information',
      metadata: {
        label: 'Population information',
        domain: 'Action for Health and Help',
        range: false,
        description: 'Description of Population information layer.'
      },
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [
          {
            id: 1,
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [-3.165556, 55.911667] },
            properties: {
              pk: 1,
              created: '2020-03-30T12:41:38.618452Z',
              Type: 'HELPER',
              name: 'MR Zdenek Zlamal',
              age: 25,
              phone_number: '+447561866337',
              email_address: 'a@b.com',
              description: 'Hello world.',
              postcode: 'EH15 1AS'
            }
          },
          {
            id: 2,
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [-3.165556, 55.912667] },
            properties: {
              pk: 2,
              created: '2020-03-30T12:42:31.761525Z',
              Type: 'HELPEE',
              name: 'MR Colin Doyle',
              age: 25,
              phone_number: '+447561866337',
              email_address: 'a@b.com',
              description: 'Hello world.',
              postcode: 'EH15 1AS'
            }
          },
          {
            id: 3,
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [-3.165456, 55.912067] },
            properties: {
              pk: 3,
              created: '2020-03-30T12:43:07.309154Z',
              Type: 'HELPER',
              name: 'MR Joel Pereira',
              age: 25,
              phone_number: '+447561866337',
              email_address: 'a@b.com',
              description: 'Hello world.',
              postcode: 'EH15 1AS'
            }
          },
          {
            id: 4,
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [-3.165656, 55.912067] },
            properties: {
              pk: 4,
              created: '2020-03-30T12:44:06.601159Z',
              Type: 'HELPEE',
              name: 'MR Michael Smith',
              age: 25,
              phone_number: '+447561866337',
              email_address: 'a@b.com',
              description: 'Hello world.',
              postcode: 'EH15 1AS'
            }
          },
          {
            id: 5,
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [-3.165656, 55.912067] },
            properties: {
              pk: 5,
              created: '2020-03-30T12:44:06.601159Z',
              Type: 'HELPEE',
              name: 'MR Michael Smith II',
              age: 25,
              phone_number: '+447561866337',
              email_address: 'a@b.com',
              description: 'Hello world.',
              postcode: 'EH15 1AS'
            }
          },
          {
            id: 6,
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [-3.165656, 55.812067] },
            properties: {
              pk: 6,
              created: '2020-03-30T12:44:06.601159Z',
              Type: 'HELPEE',
              name: 'Ms Jane Doe',
              age: 25,
              phone_number: '+447561866337',
              email_address: 'a@b.com',
              description: 'Hello world.',
              postcode: 'EH15 1AS'
            }
          },
          {
            id: 7,
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [-3.165656, 55.814067] },
            properties: {
              pk: 7,
              created: '2020-03-30T12:44:06.601159Z',
              Type: 'HELPEE',
              name: 'Ms Jane Doe-Smith',
              age: 25,
              phone_number: '+447561866337',
              email_address: 'a@b.com',
              description: 'Hello world.',
              postcode: 'EH15 1AS'
            }
          },
          {
            id: 8,
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [-3.165656, 55.814067] },
            properties: {
              pk: 8,
              created: '2020-03-30T12:44:06.601159Z',
              Type: 'HELPER',
              name: 'MR Jack Frost',
              age: 25,
              phone_number: '+447561866337',
              email_address: 'a@b.com',
              description: 'Hello world.',
              postcode: 'EH15 1AS'
            }
          },
          {
            id: 9,
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [-3.165656, 55.814067] },
            properties: {
              pk: 9,
              created: '2020-03-30T12:44:06.601159Z',
              Type: 'HELPEE',
              name: 'MR John Hancock',
              age: 25,
              phone_number: '+447561866337',
              email_address: 'a@b.com',
              description: 'Hello world.',
              postcode: 'EH15 1AS'
            }
          }
        ]
      }
    },
    {
      name: 'health-infrastructure',
      metadata: {
        label: 'Health infrastructure',
        domain: 'Action for Health and Help',
        range: false,
        description: 'Description of Health infrastructure layer.'
      },
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [
          {
            id: 1,
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [-3.16856, 55.911667] },
            properties: {
              pk: 1,
              type: 'hospitals',
              name: 'Hospital One',
              phone_number: '+447561866337',
              address1: '1 Street Name',
              address2: 'Edinburgh',
              postcode: 'EH15 1AS'
            }
          },
          {
            id: 2,
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [-3.165856, 55.911567] },
            properties: {
              pk: 2,
              type: 'gp-surgeries',
              name: 'GP One',
              phone_number: '+447561866337',
              address1: '1 Street Name',
              address2: 'Edinburgh',
              postcode: 'EH15 1AS'
            }
          },
          {
            id: 3,
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [-3.165856, 55.911467] },
            properties: {
              pk: 3,
              type: 'nhs',
              name: 'NHS Trust One',
              phone_number: '+447561866337',
              address1: '1 Street Name',
              address2: 'Edinburgh',
              postcode: 'EH15 1AS'
            }
          },
          {
            id: 4,
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [-3.165856, 55.912067] },
            properties: {
              pk: 4,
              type: 'pharmacies',
              name: 'Pharmacy One',
              phone_number: '+447561866337',
              address1: '1 Street Name',
              address2: 'Edinburgh',
              postcode: 'EH15 1AS'
            }
          }
        ]
      }
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
      [-3.167660760641553, 55.99286861572247],
      [-2.903923859716656, 55.99286861572247],
      [-2.903923859716656, 55.845904872061936],
      [-3.167660760641553, 55.845904872061936],
      [-3.167660760641553, 55.99286861572247]
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
      [-3.167660760641553, 55.99286861572247],
      [-2.903923859716656, 55.99286861572247],
      [-2.903923859716656, 55.845904872061936],
      [-3.167660760641553, 55.845904872061936],
      [-3.167660760641553, 55.99286861572247]
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
      [-3.167660760641553, 55.99286861572247],
      [-2.903923859716656, 55.99286861572247],
      [-2.903923859716656, 55.845904872061936],
      [-3.167660760641553, 55.845904872061936],
      [-3.167660760641553, 55.99286861572247]
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
    metadata: {
      summary: {
        date: '2016-12-07T10:54:32.026Z',
        instrument: 'MSI',
        mode: 'INS-NOBS',
        satellite: 'Sentinel-2',
        size: '736.49 MB'
      },
      name_of_instrument: 'Multi-Spectral Instrument',
      operational_mode_of_sensor: 'INS-NOBS',
      orbit_direction: 'DESCENDING',
      product_type: 'S2MSI1C',
      cloud_coverage: 97.5818
    },
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
    metadata: {
      summary: {
        date: '2016-12-07T10:54:32.026Z',
        instrument: 'MSI',
        mode: 'INS-NOBS',
        satellite: 'Sentinel-2',
        size: '736.49 MB'
      },
      name_of_instrument: 'Multi-Spectral Instrument',
      operational_mode_of_sensor: 'INS-NOBS',
      orbit_direction: 'DESCENDING',
      product_type: 'S2MSI1C',
      cloud_coverage: 97.5818
    },
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
    metadata: {
      summary: {
        date: '2016-12-07T10:54:32.026Z',
        instrument: 'MSI',
        mode: 'INS-NOBS',
        satellite: 'Sentinel-2',
        size: '736.49 MB'
      },
      name_of_instrument: 'Multi-Spectral Instrument',
      operational_mode_of_sensor: 'INS-NOBS',
      orbit_direction: 'DESCENDING',
      product_type: 'S2MSI1C',
      cloud_coverage: 97.5818
    },
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
    metadata: {
      summary: {
        date: '2016-12-07T10:54:32.026Z',
        instrument: 'MSI',
        mode: 'INS-NOBS',
        satellite: 'Sentinel-2',
        size: '736.49 MB'
      },
      name_of_instrument: 'Multi-Spectral Instrument',
      operational_mode_of_sensor: 'INS-NOBS',
      orbit_direction: 'DESCENDING',
      product_type: 'S2MSI1C',
      cloud_coverage: 97.5818
    },
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
    metadata: {
      summary: {
        date: '2016-12-07T10:54:32.026Z',
        instrument: 'MSI',
        mode: 'INS-NOBS',
        satellite: 'Sentinel-2',
        size: '736.49 MB'
      },
      name_of_instrument: 'Multi-Spectral Instrument',
      operational_mode_of_sensor: 'INS-NOBS',
      orbit_direction: 'DESCENDING',
      product_type: 'S2MSI1C',
      cloud_coverage: 97.5818
    },
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
    metadata: {
      summary: {
        date: '2016-12-07T10:54:32.026Z',
        instrument: 'MSI',
        mode: 'INS-NOBS',
        satellite: 'Sentinel-2',
        size: '736.49 MB'
      },
      name_of_instrument: 'Multi-Spectral Instrument',
      operational_mode_of_sensor: 'INS-NOBS',
      orbit_direction: 'DESCENDING',
      product_type: 'S2MSI1C',
      cloud_coverage: 97.5818
    },
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
    metadata: {
      summary: {
        date: '2016-12-07T10:54:32.026Z',
        instrument: 'MSI',
        mode: 'INS-NOBS',
        satellite: 'Sentinel-2',
        size: '736.49 MB'
      },
      name_of_instrument: 'Multi-Spectral Instrument',
      operational_mode_of_sensor: 'INS-NOBS',
      orbit_direction: 'DESCENDING',
      product_type: 'S2MSI1C',
      cloud_coverage: 97.5818
    },
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
    metadata: {
      summary: {
        date: '2016-12-07T10:54:32.026Z',
        instrument: 'MSI',
        mode: 'INS-NOBS',
        satellite: 'Sentinel-2',
        size: '736.49 MB'
      },
      name_of_instrument: 'Multi-Spectral Instrument',
      operational_mode_of_sensor: 'INS-NOBS',
      orbit_direction: 'DESCENDING',
      product_type: 'S2MSI1C',
      cloud_coverage: 97.5818
    },
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
    metadata: {
      summary: {
        date: '2016-12-07T10:54:32.026Z',
        instrument: 'MSI',
        mode: 'INS-NOBS',
        satellite: 'Sentinel-2',
        size: '736.49 MB'
      },
      name_of_instrument: 'Multi-Spectral Instrument',
      operational_mode_of_sensor: 'INS-NOBS',
      orbit_direction: 'DESCENDING',
      product_type: 'S2MSI1C',
      cloud_coverage: 97.5818
    },
    tile_url:
      'https://landsat-pds.s3.amazonaws.com/c1/L8/027/033/LC08_L1TP_027033_20190613_20190619_01_T1/LC08_L1TP_027033_20190613_20190619_01_T1_thumb_small.jpg',
    thumbnail_url:
      'https://landsat-pds.s3.amazonaws.com/c1/L8/027/033/LC08_L1TP_027033_20190613_20190619_01_T1/LC08_L1TP_027033_20190613_20190619_01_T1_thumb_small.jpg',
    satellite: 'sentinel-2'
  }
];

let stories = [
  {
    title: 'History of Hibs',
    subtitle: 'Location of places played',
    theme: 'satellite',
    chapters: [
      {
        id: 'birthplace',
        title: 'The Cowgate',
        image: '',
        description: 'This is where the team started',
        location: {
          center: [-3.1887179999999944, 55.948564000000005],
          zoom: 16,
          pitch: 0.0,
          bearing: 0.0
        },
        onEnter: [
          {
            id: 'cowgate',
            type: 'vector',
            url: 'https://staticdata.testing.or3is.com/astrosat/test/stoke-on-trent/v1/metadata.json'
          },
          {
            id: 'cowgate-infrastructure',
            type: 'geojson',
            url: 'https://staticdata.testing.or3is.com/astrosat/core/hospitals-uk/2019-12-17/hospitals_uk.geojson'
          }
        ]
      },
      {
        id: 'meadows',
        title: 'The Meadows',
        image: '',
        description: 'This is where the team played',
        location: {
          center: [-3.1943694999999934, 55.941046],
          zoom: 16,
          pitch: 0.0,
          bearing: 0.0
        }
      },
      {
        id: 'easterrd',
        title: 'Easter Road',
        image: '',
        description: 'This is where the team play',
        location: {
          center: [-3.165666500000043, 55.9617145],
          zoom: 16,
          pitch: 0.0,
          bearing: 0.0
        },
        onEnter: [
          {
            id: 'easterrd',
            type: 'vector',
            url: 'https://staticdata.testing.or3is.com/astrosat/test/stoke-on-trent/v1/metadata.json'
          },
          {
            id: 'easterrd-infrastructure',
            type: 'geojson',
            url: 'https://staticdata.testing.or3is.com/astrosat/core/hospitals-uk/2019-12-17/hospitals_uk.geojson'
          }
        ],
        onLeave: []
      }
    ]
  },
  {
    title: 'History of Something else',
    subtitle: 'Location of places in story',
    theme: 'light',
    chapters: [
      {
        id: 'place1',
        title: 'Place One',
        image: '',
        description: 'This is Place One Description',
        location: {
          center: [-3.1887179999999944, 55.948564000000005],
          zoom: 16,
          pitch: 0.0,
          bearing: 0.0
        }
      },
      {
        id: 'place2',
        title: 'Place Two',
        image: '',
        description: 'This is Place Two Description',
        location: {
          center: [-3.1943694999999934, 55.941046],
          zoom: 16,
          pitch: 0.0,
          bearing: 0.0
        }
      },
      {
        id: 'place3',
        title: 'Place Three',
        image: '',
        description: 'This is Place Three Description',
        location: {
          center: [-3.165666500000043, 55.9617145],
          zoom: 16,
          pitch: 0.0,
          bearing: 0.0
        }
      }
    ]
  }
];

let currentUser = null;

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

const deleteBookmark = (req, res) => {
  bookmarks = bookmarks.filter(bookmark => bookmark.id !== parseInt(req.params.id, 10));
  res.status(200);
  res.json(bookmarks);
};

const changePassword = (req, res) => {
  console.log(`Changing User Password`);
  const oldPassword = req.body.old_password;
  const newPassword = req.body.new_password1;
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
  res.json(pinnedScenes[pinnedScenes.length - 1]);
};

const deletePinnedScene = (req, res) => {
  pinnedScenes = pinnedScenes.filter(scene => scene.id !== req.params.id);
  res.status(200);
};

const getStories = (req, res) => {
  console.log('Returning Stories');
  const userStories = stories.filter(story => story.owner === currentUser.id);

  res.status(200);
  res.json(userStories);
};

const addStory = (req, res) => {
  console.log('Adding Story');
  const story = {
    ...req.body
  };

  stories = [...stories, story];

  res.status(200);
  res.json(story);
};

const deleteStory = (req, res) => {
  stories = stories.filter(story => story.id !== req.params.id);
  res.status(200);
};

module.exports = {
  getUsers,
  getCurrentUser,
  getSatellites,
  searchSatelliteScenes,
  register,
  login,
  logout,
  getBookmarks,
  addBookmark,
  deleteBookmark,
  changePassword,
  getSources,
  getSatelliteSearches,
  saveSatelliteSearch,
  deleteSatelliteSearch,
  getPinnedScenes,
  pinScene,
  deletePinnedScene,
  getStories,
  addStory,
  deleteStory
};
