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
    sidebar_component: 'InfrastructureLegend',
    map_component: 'ActionForHelpMapComponent',
  },
  type: 'vector',
  data:
    '/static-data/astrosat/hourglass/northern-ireland-infrastructure/v1/northern-ireland-infrastructure.json',
};
