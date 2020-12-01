module.exports = {
  source_id: 'lanterne/data/crowdless/v1',
  authority: 'lanterne',
  namespace: 'data',
  name: 'crowdless',
  version: 'v1',
  type: 'vector',
  metadata: {
    request_strategy: 'manual',
    url: '/api/data/crowdedness?latitude={x}&longitude={y}&radius={r}',
    name: 'crowdless',
    label: 'Crowdless Live Data',
    domain: 'ORBIS Core Datasets',
    application: {
      orbis: {
        layer: {
          name: 'IconLayer',
          props: {
            config: 'crowdlessConfig',
          },
        },
        orbs: [{ name: 'ORBIS Core Datasets' }],
        categories: {
          name: 'Live Data',
          child: {
            name: 'Crowdless',
            child: {
              name: 'Supermarket Crowdedness',
            },
          },
        },
        map_component: {
          name: 'CrowdlessMapComponent',
        },
        sidebar_component: {
          name: 'CrowdlessSidebarComponent',
          props: {
            searchRadius: 3000,
          },
        },
      },
    },
    description:
      'Crowdedness means how busy a store is and how likely there are to be queues. This data layer provide live information about your local and non shops.',
  },
};
