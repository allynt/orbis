module.exports = {
  name: 'hourglass',
  namespace: 'covid',
  authority: 'astrosat',
  source_id: 'astrosat/covid/hourglass/latest',
  status: 'published',
  type: 'vector',
  version: 'latest',
  metadata: {
    label: 'Population information',
    domain: 'Action for Health',
    range: false,
    description: 'Description of Population information layer.',
    sidebar_component: 'PopulationLegend',
  },
  data: '/static-data/astrosat/hourglass/people/v1/people.json',
};
