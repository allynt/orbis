module.exports = {
  source_id: 'astrosat/test/stoke-on-trent/v1',
  authority: 'astrosat',
  namespace: 'test',
  name: 'stoke-on-trent',
  version: 'v1',
  type: 'vector', // vector|raster
  status: 'published', // draft|published|deprecated
  metadata: {
    label: 'Stoke-On-Trent',
    domain: 'Rice Paddies',
    range: true,
    description: 'Rice Paddies has name stoke-on-trent with a label Stoke-On-Trent Some paragraph describing stuff',
    url: 'https://staticdata.testing.or3is.com/astrosat/test/stoke-on-trent/v1/{z}/{x}/{y}.pbf',
  },
};
