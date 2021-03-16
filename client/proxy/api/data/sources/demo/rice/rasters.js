const authority = 'astrosat',
  namespace = 'demo',
  name = 'rice';

module.exports = {
  name,
  namespace,
  authority,
  source_id: `${authority}/${namespace}/${name}/latest`,
  status: 'published',
  type: 'raster',
  version: 'latest',
  metadata: {
    url: 'http://localhost:8000/static-data/astrosat/demo/rice/latest',
    label: 'Rice rasters',
    title: 'rice_raster_info',
    application: {
      orbis: {
        layer: {
          name: 'BitmapLayer',
          props: {
            config: 'demoRiceRasterConfig',
          },
        },
      },
    },
    properties: [
      {
        name: 'ndvi',
        label: 'NDVI',
        dates: [
          '2020-03-12 03:35:31',
          '2020-05-06 03:35:29',
          '2020-07-25 03:35:39',
        ],
        rasters: [
          'ndvi_20200312.png',
          'ndvi_20200506.png',
          'ndvi_20200725.png',
        ],
        clip_max: 0.76,
        clip_min: -0.07,
        colour_bar: 'ndvi_colourbar.png',
        bounds: [
          100.42684677700454,
          5.839335465057107,
          100.48749559928604,
          5.914446003530912,
        ],
      },
      {
        name: 'ndmi',
        label: 'NDMI',
        dates: [
          '2020-03-12 03:35:31',
          '2020-05-06 03:35:29',
          '2020-07-25 03:35:39',
        ],
        rasters: [
          'ndmi_20200312.png',
          'ndmi_20200506.png',
          'ndmi_20200725.png',
        ],
        clip_max: 0.55,
        clip_min: -0.07,
        colour_bar: 'ndmi_colourbar.png',
        bounds: [
          100.42684677700454,
          5.839335465057107,
          100.48749559928604,
          5.914446003530912,
        ],
      },
      {
        name: 'rgb',
        label: 'True Colour',
        dates: [
          '2020-03-12 03:35:31',
          '2020-05-06 03:35:29',
          '2020-07-25 03:35:39',
        ],
        rasters: ['rgb_20200312.png', 'rgb_20200506.png', 'rgb_20200725.png'],
        bounds: [
          100.42684677700454,
          5.839335465057107,
          100.48749559928604,
          5.914446003530912,
        ],
      },
    ],
  },
};
