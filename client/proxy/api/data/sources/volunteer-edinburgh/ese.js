module.exports = {
  name: 'volunteer-edinburgh',
  namespace: 'ese',
  authority: 'astrosat',
  source_id: 'astrosat/volunteer-edinburgh/ese/v1',
  status: 'published',
  type: 'vector',
  version: 'latest',
  metadata: {
    request_strategy: 'manual',
    url: '/api/data/sources/volunteer-edinburgh/ese',
    name: 'Action for Help (VE)',
    label: 'ESE Members',
    domain: 'Action for Help (VE)',
    application: {
      orbis: {
        layer: {
          name: 'GeoJsonPinLayer"',
          props: {
            config: 'pinIconConfig',
          },
        },
        orbs: [{ name: 'Action for Help (VE)' }],
        categories: {
          name: 'Custom Data',
          child: {
            name: 'Volunteers Edinburgh Data',
          },
        },
        map_component: {
          name: 'FeatureDetailPopup',
        },
        sidebar_component: {
          name: 'LayerVisibilityCheckbox',
          props: {
            color: '#51c16a',
          },
        },
      },
    },
    description: 'Test description.',
  },
  data:
    '/static-data/astrosat/volunteer-edinburgh/ese/v1.VE_ESE_members.geojson',
};
