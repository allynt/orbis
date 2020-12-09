const authority = 'astrosat',
  namespace = 'mysupplylynk',
  name = 'more-suppliers',
  version = 'latest';

module.exports = {
  source_id: 'astrosat/mysupplylynk/more-suppliers/latest',
  authority,
  namespace,
  name,
  version,
  type: 'vector',
  status: 'published',
  data: `static-data/${authority}/${namespace}/${name}/${version}/more-suppliers.js`,
  metadata: {
    label: 'Additional Suppliers',
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
          props: { name: 'moreSuppliers' },
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
