const authority = 'astrosat',
  namespace = 'mysupplylynk',
  name = 'suppliers',
  version = 'latest';

module.exports = {
  source_id: 'astrosat/mysupplylynk/suppliers/latest',
  authority,
  namespace,
  name,
  version,
  type: 'vector',
  status: 'published',
  data: `static-data/${authority}/${namespace}/${name}/${version}/suppliers.json`,
  metadata: {
    label: 'MySupplyLynk',
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
          props: { config: 'pinIconConfig' },
        },
      },
    },
  },
};
