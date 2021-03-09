import React from 'react';

import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

import PDF from './pdf-export.component';

const mockStore = configureMockStore();

export default { title: 'Analysis Panel/PDF Export' };

const defaultUser = { name: 'John Smith', email: 'johnsmith@gmail.com' };

const generateFeatures = n => {
  return new Array(n).fill(undefined).map(feat => ({
    object: {
      properties: {
        area_name: 'test_area_name',
        population: 1200,
        households: 260,
        '% of people aged 0-17': 13.6,
        '% of people aged 18-39': 11.6,
        '% of people aged 40-64': 44.7,
        '% of people aged 65+': 30.1,
      },
    },
  }));
};

const defaultState = {
  screenshot: undefined,
  property: {
    source_id: 'astrosat/isolation_plus/age_census/r4v1',
    source: 'testsourcename',
    details: 'This is a test description',
    name: '% of people aged 0-17',
    label: 'Test label',
    aggregation: 'mean',
    aggregates: { GB: 20.4, England: 20.8, Scotland: 18.8, Wales: 20.3 },
    precision: 1,
    breakdown: [
      '% of people aged 0-17',
      '% of people aged 18-39',
      '% of people aged 40-64',
      '% of people aged 65+',
    ],
  },
  clickedFeatures: generateFeatures(3),
};

const Template = ({ user = defaultUser, state = defaultState }) => (
  <Provider
    store={mockStore({
      orbs: {
        isolationPlus: state,
      },
    })}
  >
    <PDF user={user} />
  </Provider>
);

export const Default = Template.bind({});

export const NoUserName = Template.bind({});
NoUserName.args = {
  user: { email: 'johnsmith@gmail.com' },
};

export const LotsOfFeatures = Template.bind({});
LotsOfFeatures.args = {
  state: {
    ...defaultState,
    clickedFeatures: generateFeatures(20),
  },
};

export const LongText = Template.bind({});
LongText.args = {
  state: {
    property: {
      source_id: 'astrosat/isolation_plus/age_census/r4v1',
      source: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      details: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      name: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      label: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      aggregation: 'mean',
      aggregates: { GB: 20.4, England: 20.8, Scotland: 18.8, Wales: 20.3 },
      precision: 1,
      breakdown: [
        '% of people aged 0-17',
        '% of people aged 18-39',
        '% of people aged 40-64',
        '% of people aged 65+',
      ],
    },
    clickedFeatures: [
      {
        object: {
          properties: {
            area_name: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
            population: 1200,
            households: 260,
            '% of people aged 0-17': 13.6,
            '% of people aged 18-39': 11.6,
            '% of people aged 40-64': 44.7,
            '% of people aged 65+': 30.1,
          },
        },
      },
      {
        object: {
          properties: {
            area_name: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
            population: 1200,
            households: 260,
            '% of people aged 0-17': 13.6,
            '% of people aged 18-39': 11.6,
            '% of people aged 40-64': 44.7,
            '% of people aged 65+': 30.1,
          },
        },
      },
    ],
  },
};
