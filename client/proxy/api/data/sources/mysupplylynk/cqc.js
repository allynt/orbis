const authority = 'astrosat',
  namespace = 'mysupplylynk',
  name = 'cqc',
  version = 'v1';

module.exports = {
  source_id: 'astrosat/mysupplylynk/cqc/v1',
  authority,
  namespace,
  name,
  version,
  type: 'vector',
  status: 'published',
  data: `static-data/${authority}/${namespace}/${name}/${version}/cqc.js`,
  metadata: {
    label: 'CQC Suppliers',
    range: 'false',
    domain: 'MySupplyLynk',
    description: 'Suppliers who can provide items',
    application: {
      orbis: {
        map_component: {
          name: 'MySupplyLynkMapComponent',
          props: { name: 'cqcSuppliers' },
        },
        sidebar_component: {
          name: 'LayerVisibilityCheckbox',
        },
        layer: {
          name: 'GeoJsonClusteredIconLayer',
          props: {
            config: 'cqcConfig',
            pinColor: 'red',
            onClick: false,
            onHover: true,
          },
        },
      },
    },
  },
};
