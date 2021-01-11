import * as React from 'react';

import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { MapProvider } from 'MapContext';
import DataLayers from './data-layers.component';

const mockStore = configureMockStore([thunk]);

export default { title: 'Data Layers/Main' };

const Template = ({ state, ...args }) => (
  <Provider store={mockStore(state)}>
    <MapProvider>
      <DataLayers {...args} />
    </MapProvider>
  </Provider>
);

export const Default = Template.bind({});

export const SelectedLayers = Template.bind({});
SelectedLayers.args = {
  state: {
    data: {
      layers: [
        'astrosat/infrastructure/scotland-infrastructure/v1',
        'astrosat/infrastructure/wales-infrastructure/v1',
      ],
      sources: [
        {
          source_id: 'astrosat/infrastructure/scotland-infrastructure/v1',
          authority: 'astrosat',
          namespace: 'infrastructure',
          name: 'scotland-infrastructure',
          metadata: {
            label: 'Scottish Local Authority Agencies',
            application: {
              orbis: {
                categories: {
                  name: 'Action for Help Scotland',
                },
                sidebar_component: {
                  name: 'InfrastructureLegend',
                },
                orbs: [
                  {
                    name: 'Action for Help',
                    description: 'Data from ActionForHelp orb',
                  },
                ],
              },
            },
            description:
              'Location of local authority agencies dedicated to Adult Protection in Scotland',
          },
        },
        {
          source_id: 'astrosat/infrastructure/wales-infrastructure/v1',
          authority: 'astrosat',
          namespace: 'infrastructure',
          name: 'wales-infrastructure',
          version: 'v1',
          type: 'vector',
          status: 'published',
          metadata: {
            label: 'Welsh Local Authority Agencies',
            domain: 'Action for Help',
            application: {
              orbis: {
                categories: {
                  name: 'Action for Help Wales',
                },
                sidebar_component: {
                  name: 'InfrastructureLegend',
                },
                orbs: [
                  {
                    name: 'Action for Help',
                    description: 'Data from ActionForHelp orb',
                  },
                ],
              },
            },
            description:
              'Location of local authority agencies dedicated to Adult Protection in Wales',
          },
        },
      ],
      error: null,
    },
  },
};
