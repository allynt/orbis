const authority = 'astrosat',
  namespace = 'mysupplylynk',
  name = 'non-registered',
  version = 'v1';

module.exports = {
  source_id: 'astrosat/mysupplylynk/non-registered/v1',
  authority,
  namespace,
  name,
  version,
  type: 'vector',
  status: 'published',
  data: `static-data/${authority}/${namespace}/${name}/${version}/non-registered.js`,
  metadata: {
    label: 'Non-registered Suppliers',
    range: 'false',
    domain: 'MySupplyLynk',
    description: 'Suppliers who can provide items',
    application: {
      orbis: {
        layer: {
          name: 'GeoJsonPinLayer',
          props: {
            config: 'categoryFilterPinIconConfig',
            pinColor: '#46aac4',
            onGroupClick: true,
            onGroupHover: false,
            onPointClick: false,
            onPointHover: true,
          },
        },
        map_component: {
          name: 'MySupplyLynkMapComponent',
          props: {
            type: 'nonRegistered',
          },
        },
        sidebar_component: {
          name: 'CheckboxFilters',
        },
      },
    },
  },
};
