('use strict');
const { getCurrentUser } = require('./api/authentication/data');

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
  getStories,
  addStory,
  deleteStory
};
