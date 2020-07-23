const authority = 'astrosat';
const namespace = 'rice';
const name = 'paddies-health';
const version = 'latest';

module.exports = {
  authority,
  namespace,
  name,
  version,
  source_id: [authority, namespace, name, version].join('/'),
  type: 'vector',
  metadata: {
    domain: 'Rice',
    label: 'Paddies Health',
    description: 'The health of the plants in rice paddies',
  },
  data: `static-data/${authority}/${namespace}/${name}/${version}/paddies_health_wflags.json`,
};
