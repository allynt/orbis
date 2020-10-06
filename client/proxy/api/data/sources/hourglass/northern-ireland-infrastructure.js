module.exports = {
  name: 'northern-ireland-infrastructure',
  namespace: 'hourglass',
  authority: 'astrosat',
  source_id: 'astrosat/hourglass/northern-ireland-infrastructure/v1',
  metadata: {
    label: 'Northern Irish Infrastructure',
    domain: 'Action for Health',
    range: false,
    description: 'Description of Health infrastructure layer.',
    application: {
      orbis: {
        sidebar_component: { name: 'InfrastructureLegend' },
        map_component: { name: 'ActionForHelpMapComponent' },
        layer: {
          name: 'GeoJsonClusteredIconLayer',
          props: { config: 'actionForHelpConfig' },
        },
      },
    },
  },
  type: 'vector',
  data:
    '/static-data/astrosat/hourglass/northern-ireland-infrastructure/v1/northern-ireland-infrastructure.json',
};
