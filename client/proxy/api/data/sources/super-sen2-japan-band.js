module.exports = {
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
    url: 'https://staticdata.testing.or3is.com/astrosat/test/super-sen2-japan-band5/dec-2019/{z}/{x}/{y}.png',
  },
};
