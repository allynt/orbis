const authority = 'astrosat',
  namespace = 'mysupplylynk',
  name = 'orbis',
  version = 'latest';

module.exports = {
  source_id: 'astrosat/mysupplylynk/orbis/latest',
  authority,
  namespace,
  name,
  version,
  type: 'vector',
  status: 'published',
  data: `static-data/${authority}/${namespace}/${name}/${version}/suppliers.js`,
  metadata: {
    label: 'MySupplyLynk',
    range: 'false',
    domain: 'MySupplyLynk',
    description: 'Suppliers who can provide items',
    application: {
      orbis: {
        layer: {
          name: 'GeoJsonPinLayer',
          props: {
            config: 'categoryFilterPinIconConfig',
            pinColor: '#a851c1',
            onGroupClick: true,
            onGroupHover: false,
            onPointClick: true,
            onPointHover: true,
          },
        },
        map_component: {
          name: 'MySupplyLynkMapComponent',
        },
        sidebar_component: {
          name: 'CheckboxFilters',
        },
      },
    },
  },
};
