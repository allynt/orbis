import React from 'react';

import { Provider } from 'react-redux';
import { MapProvider } from 'MapContext';

import configureMockStore from 'redux-mock-store';

import { Dialog } from '@astrosat/astrosat-ui';

import PDF from './pdf-export.component';

const mockStore = configureMockStore();

export default {
  title: 'Analysis Panel/PDF Export',
  argTypes: { close: { action: 'close' } },
};

const defaultUser = { name: 'John Smith', email: 'johnsmith@gmail.com' };

const generateFeatures = n => {
  return new Array(n).fill(undefined).map(() => ({
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

const Template = ({
  user = defaultUser,
  licence = 'test-licence',
  state = defaultState,
  ...args
}) => {
  return (
    <Provider
      store={mockStore({
        accounts: { user },
        orbs: {
          isolationPlus: state,
        },
      })}
    >
      <MapProvider>
        <Dialog open maxWidth="lg" aria-labelledby="pdf-export-dialog">
          <PDF licence={licence} creationDate={'March 12th 2021'} {...args} />
        </Dialog>
      </MapProvider>
    </Provider>
  );
};

export const Default = Template.bind({});

export const NoUserName = Template.bind({});
NoUserName.args = {
  user: { email: 'johnsmith@gmail.com' },
};

export const OneFeature = Template.bind({});
OneFeature.args = {
  state: {
    ...defaultState,
    clickedFeatures: generateFeatures(1),
  },
};

export const LotsOfFeatures = Template.bind({});
LotsOfFeatures.args = {
  state: {
    ...defaultState,
    clickedFeatures: generateFeatures(20),
  },
};

export const ZeroValues = Template.bind({});
ZeroValues.args = {
  state: {
    property: {
      source_id: 'astrosat/isolation_plus/age_census/r4v1',
      source: 'testsourcename',
      details: 'This is a test description',
      name: '% of people aged 0-17',
      label: 'Test label',
      aggregation: 'mean',
      aggregates: { GB: 0, England: 0, Scotland: 0, Wales: 0 },
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
            area_name: 'test-name-1',
            population: 0,
            households: 0,
            '% of people aged 0-17': 0,
            '% of people aged 18-39': 0,
            '% of people aged 40-64': 0,
            '% of people aged 65+': 0,
          },
        },
      },
      {
        object: {
          properties: {
            area_name: 'test-name-2',
            population: 0,
            households: 0,
            '% of people aged 0-17': 0,
            '% of people aged 18-39': 0,
            '% of people aged 40-64': 0,
            '% of people aged 65+': 0,
          },
        },
      },
    ],
  },
};

export const LongText = Template.bind({});
LongText.args = {
  user: {
    name: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    email: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@gmail.com',
  },
  state: {
    property: {
      source_id: 'astrosat/isolation_plus/age_census/r4v1',
      source: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      details: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      name: '% of people aged 0-17',
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

export const LongTextBodies = Template.bind({});

const longText =
  'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Hic, quas iure. Quia, nobis harum inventore velit blanditiis explicabo reiciendis quam debitis ex vero error consectetur eveniet sequi cumque voluptas ea.';

LongTextBodies.args = {
  licence: longText,
  state: {
    ...defaultState,
    property: {
      ...defaultState.property,
      source: longText,
      details: longText,
    },
  },
};
