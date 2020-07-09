module.exports = {
  name: 'people',
  namespace: 'hourglass',
  authority: 'astrosat',
  source_id: 'astrosat/hourglass/people/v1',
  status: 'published',
  type: 'vector',
  version: 'v1',
  metadata: {
    label: 'Population information',
    domain: 'Action for Health',
    range: false,
    description: 'Description of Population information layer.',
    filters: ['Type', 'Availability', 'Contact Details.Country'],
  },
  data: '/static-data/astrosat/hourglass/people/v1/people.json',
};
