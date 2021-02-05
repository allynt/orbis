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
        layer: {
          name: 'GeoJsonPinLayer',
          props: {
            config: 'pinIconConfig',
            pinColor: '#a851c1',
            onGroupClick: true,
            onGroupHover: false,
            onPointClick: false,
            onPointHover: true,
          },
        },
        map_component: {
          name: 'FeatureDetailPopup',
        },
        sidebar_component: {
          name: 'LayerVisibilityCheckbox',
        },
      },
    },
  },
};
