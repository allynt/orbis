module.exports = {
  source_id: 'lanterne/data/crowdless/v1',
  authority: 'lanterne',
  namespace: 'data',
  name: 'crowdless',
  version: 'v1',
  type: 'vector',
  manual: true,
  metadata: {
    url:
      'https://258636rmyd.execute-api.eu-west-1.amazonaws.com/staging/crowdedness/live/places?latitude={x}&longitude={y}&radius={r}',
    name: 'crowdless',
    label: 'Crowdless Live Data',
    domain: 'ORBIS Core Datasets',
    application: {
      orbis: {
        // layer: {
        //   name: 'GeoJsonClusteredIconLayer',
        //   props: {
        //     config: 'crowdlessConfig',
        //   },
        // },
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
          name: 'ActionForHelpMapComponent',
        },
        sidebar_component: {
          name: 'CrowdlessSidebarComponent',
        },
      },
    },
    description:
      'Crowdedness means how busy a store is and how likely there are to be queues. This data layer provide live information about your local and non shops.',
  },
};
