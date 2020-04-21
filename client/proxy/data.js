('use strict');
const { getCurrentUser } = require('./api/authentication/data');

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

const getBookmarks = (req, res) => {
  console.log('Returning Bookmarks');
  const currentUser = getCurrentUser();
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

const getSources = (req, res) => {
  res.status(200);
  res.json(sources);
};

const getStories = (req, res) => {
  console.log('Returning Stories');
  const currentUser = getCurrentUser();
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
  getBookmarks,
  addBookmark,
  deleteBookmark,
  getSources,
  getStories,
  addStory,
  deleteStory
};
