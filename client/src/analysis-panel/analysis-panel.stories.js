import * as React from 'react';

import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { SHARED_STATE_KEY } from 'map/orbs/layers.slice';
import { MapProvider } from 'MapContext';

import { AnalysisPanel } from './analysis-panel.component';

const mockStore = configureMockStore([thunk]);

const selectedProperty = {
  source_id: 'test/layer',
  max: 2677,
  min: 0,
  name: 'people aged 0-17',
  type: 'continuous',
  label: 'Number of people in the age band 0-17',
  units: 'person',
  source: 'ONS, NRS (2019)',
  details: 'Total number of people aged 17 and under.',
  clip_max: 826,
  clip_min: 39,
  breakdown: [
    'people aged 0-17',
    'people aged 18-39',
    'people aged 40-64',
    'people aged 65+',
  ],
  precision: 0,
  aggregates: {
    GB: 13682669,
    Wales: 629939,
    England: 12023568,
    Scotland: 1029162,
  },
  aggregation: 'sum',
  application: {
    orbis: {
      label: 'People in the age band 0-17',
      display: {
        color: 'viridis',
        colormap_type: 'neutral_sequential',
        colormap_reversed: false,
      },
      data_visualisation_components: [
        {
          name: 'NationalDeviationHistogram',
          props: {
            data: [
              {
                x: 134,
                y: 15015,
              },
              {
                x: 402,
                y: 23278,
              },
              {
                x: 670,
                y: 2953,
              },
              {
                x: 938,
                y: 383,
              },
              {
                x: 1206,
                y: 70,
              },
              {
                x: 1474,
                y: 18,
              },
              {
                x: 1742,
                y: 8,
              },
              {
                x: 2010,
                y: 2,
              },
              {
                x: 2278,
                y: 1,
              },
              {
                x: 2546,
                y: 1,
              },
            ],
          },
        },
      ],
    },
  },
  description: 'Total number of people aged 17 and under.',
  property_group: 'age_demographics_ons.age_band_0_17',
};

const clickedFeatures = [
  {
    object: {
      properties: {
        area_name: 'test-name',
        'people aged 0-17': 20,
        'people aged 18-39': 20,
        'people aged 40-64': 20,
        'people aged 65+': 20,
      },
    },
  },
];

export default { title: 'Analysis Panel/Main' };

const Template = ({ clickedFeatures, selectedProperty }) => (
  <Provider
    store={mockStore({
      orbs: {
        layers: {
          [SHARED_STATE_KEY]: {
            other: {
              property: selectedProperty,
            },
          },
          'test/layer': {
            clickedFeatures,
          },
        },
      },
    })}
  >
    <MapProvider>
      <div style={{ marginLeft: 'calc(100% - 20rem)' }}>
        <AnalysisPanel />
      </div>
    </MapProvider>
  </Provider>
);

export const Default = Template.bind({});
Default.args = {
  selectedProperty,
  clickedFeatures,
};

export const NoPdfExport = Template.bind({});
NoPdfExport.args = {
  selectedProperty: { ...selectedProperty, type: 'discrete' },
  clickedFeatures,
};
