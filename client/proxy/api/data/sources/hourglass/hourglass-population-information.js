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
    application: {
      orbis: {
        sidebar_component: [
          { name: 'DateRangeFilter', props: { maxDate: 'today' } },
          {
            name: 'DropdownFilter',
            props: {
              label: 'Status Select',
              defaultValue: 'ALL',
              options: [
                {
                  value: 'ALL',
                  label: 'All',
                },
                {
                  value: 'NEW',
                  label: 'New',
                },
                {
                  value: 'PENDING',
                  label: 'Pending',
                },
                {
                  value: 'COMPLETE',
                  label: 'Complete',
                },
                {
                  value: 'FOLLOWUP',
                  label: 'Followup',
                },
              ],
            },
          },
          { name: 'PopulationLegend' },
        ],
        map_component: { name: 'ActionForHelpMapComponent' },
        layer: {
          name: 'GeoJsonClusteredIconLayer',
          props: { config: 'actionForHelpConfig' },
        },
      },
    },
  },
  data: '/static-data/astrosat/hourglass/people/v1/people.json',
};
