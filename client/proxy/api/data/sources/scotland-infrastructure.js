module.exports = {
  name: 'scotland-infrastructure',
  namespace: 'hourglass',
  authority: 'astrosat',
  metadata: {
    label: 'Scottish Infrastructure',
    domain: 'Action for Health',
    range: false,
    description: 'Description of Health infrastructure layer.',
  },
  type: 'vector',
  data:
    'http://localhost:8000/static-data/astrosat/hourglass/scotland-infrastructure/v1/scotland_infrastructure.json',
};
