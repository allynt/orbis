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
        sidebar_component: {
          name: 'CheckboxFilters',
        },
        map_component: {
          name: 'MySupplyLynkMapComponent',
        },
        layer: {
          name: 'GeoJsonClusteredIconLayer',
          props: {
            config: 'pinIconConfig',
            pinColor: 'cyan',
            onClick: false,
            onHover: true,
          },
        },
      },
    },
  },
};
