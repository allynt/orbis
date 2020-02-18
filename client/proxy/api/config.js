('use strict');

const appConfig = {
  trackingId: 'UA-143753043-1',
  mapbox_token: 'pk.eyJ1IjoidGhlcm1jZXJ0IiwiYSI6ImNqbmN5N2F6NzBnODYza3A2anVqYWExOW8ifQ.10y0sH8cDQp9AfZNg1-M3Q'
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
  { id: 'sentinel-1', label: 'Sentinel-1', description: 'Some text describing the Sentinel-1 satellite' },
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
  { id: 'landsat', label: 'Landsat', description: 'Some text describing the Landsat satellite' },
  { id: 'envisat-meris', label: 'Envisat Meris', description: 'Some text describing the Envisat Meris satellite' },
  { id: 'modis', label: 'MODIS', description: 'Some text describing the MODIS satellite' },
  { id: 'proba-v', label: 'Proba-V', description: 'Some text describing the Proba-V satellite' },
  { id: 'gibs', label: 'GIBS', description: 'Some text describing the GIBS satellite' }
];

const visualisations = [
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

const getVisualisations = (req, res) => {
  console.log('Returning vizualizations');
  res.status(200);
  res.json(visualisations);
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

module.exports = {
  getAppConfig,
  getUsers,
  getCurrentUser,
  getSatellites,
  getVisualisations,
  register,
  login,
  logout,
  getBookmarks,
  addBookmark,
  changePassword,
  getSources
};
