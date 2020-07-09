module.exports = {
  name: 'scotland-infrastructure',
  namespace: 'hourglass',
  authority: 'astrosat',
  source_id: 'astrosat/hourglass/scotland-infrastructure/v1',
  metadata: {
    label: 'Scottish Infrastructure',
    domain: 'Action for Health',
    range: false,
    description: 'Description of Health infrastructure layer.',
  },
  type: 'vector',
  data:
    '/static-data/astrosat/hourglass/scotland-infrastructure/v1/scotland_infrastructure.json',
};
