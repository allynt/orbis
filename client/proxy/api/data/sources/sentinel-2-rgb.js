module.exports = {
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
      'https://staticdata.testing.or3is.com/astrosat/test/sentinel_2_rgb/S2A_20191223T034141_T47NPG_RGB/{z}/{x}/{y}.png',
  },
};
