import React from 'react';

import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { IsolationPlusPropertyRadioGroup } from './isolation-plus-property-radio-group.component';

const mockStore = configureMockStore([thunk]);

const selectedLayer = {
  source_id: 'astrosat/isolation_plus/age_ons/r3v1',
  authority: 'astrosat',
  namespace: 'isolation_plus',
  name: 'age_ons',
  version: 'r3v1',
  type: 'vector',
  status: 'published',
  metadata: {
    crs: 'EPSG: 4326',
    data: [
      'shareddata://projects/isolation+/Products_Release_R3_202011/LSOA_GB_AGE_BANDS_2019/lsoa_gb_age_2019_age_bands.csv',
    ],
    name: 'Update ONS demographics to 2019 ',
    index: 'LSOA Code',
    label: 'Age Demographics - ONS 2019',
    tiles: [
      'https://staticdata.staging.astrosat.net/astrosat/isolation_plus/age_ons/r3v1/lsoa_gb_age_2019_age_bands__mvt/{z}/{x}/{y}.pbf',
    ],
    bounds: [-180, -85.05112877980659, 180, 85.0511287798066],
    center: [-76.275329586789, 39.153492567373, 8],
    maxZoom: 11,
    minZoom: 0,
    version: '1.0.0',
    timestamp: '2020-11-03',
    properties: [
      {
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
            data_visualisation_components: {
              name: 'Bar',
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
          },
        },
        description: 'Total number of people aged 17 and under.',
        property_group: 'age_demographics_ons.age_band_0_17',
      },
      {
        max: 55.6,
        min: 0.9,
        name: '% of people aged 0-17',
        type: 'percentage',
        label: '% of people in the age band 0 - 17',
        units: '%',
        source: 'ONS, NRS (2019)',
        details: 'Percentage of people aged 17 and under.',
        clip_max: 36.3,
        clip_min: 5.3,
        breakdown: [
          '% of people aged 0-17',
          '% of people aged 18-39',
          '% of people aged 40-64',
          '% of people aged 65+',
        ],
        precision: 1,
        aggregates: {
          GB: 20.7,
          Wales: 19.9,
          England: 21.2,
          Scotland: 18.7,
        },
        aggregation: 'mean',
        application: {
          orbis: {
            label: 'People in the age band 0-17',
            display: {
              color: 'viridis',
              colormap_type: 'neutral_sequential',
              colormap_reversed: false,
            },
            data_visualisation_components: {
              name: 'Bar',
              props: {
                data: [
                  {
                    x: 3,
                    y: 266,
                  },
                  {
                    x: 9,
                    y: 1491,
                  },
                  {
                    x: 15,
                    y: 10520,
                  },
                  {
                    x: 21,
                    y: 19034,
                  },
                  {
                    x: 27,
                    y: 8342,
                  },
                  {
                    x: 33,
                    y: 1834,
                  },
                  {
                    x: 39,
                    y: 216,
                  },
                  {
                    x: 45,
                    y: 22,
                  },
                  {
                    x: 51,
                    y: 3,
                  },
                  {
                    x: 57,
                    y: 1,
                  },
                ],
              },
            },
          },
        },
        description: 'Percentage of people aged 17 and under.',
        property_group: 'age_demographics_ons.age_band_0_17',
      },
      {
        max: 10452,
        min: 0,
        name: 'people aged 18-39',
        type: 'continuous',
        label: 'Number of people in the age band 18 - 39',
        units: 'person',
        source: 'ONS, NRS (2019)',
        details: 'Total number of people aged 18 to 39 inclusive.',
        clip_max: 917,
        clip_min: 72,
        breakdown: [
          'people aged 0-17',
          'people aged 18-39',
          'people aged 40-64',
          'people aged 65+',
        ],
        precision: 0,
        aggregates: {
          GB: 18478478,
          Wales: 859732,
          England: 16048549,
          Scotland: 1570197,
        },
        aggregation: 'sum',
        application: {
          orbis: {
            label: 'People in the age band 18-39',
            display: {
              color: 'viridis',
              colormap_type: 'neutral_sequential',
              colormap_reversed: false,
            },
            data_visualisation_components: {
              name: 'Bar',
              props: {
                data: [
                  {
                    x: 523,
                    y: 40350,
                  },
                  {
                    x: 1569,
                    y: 1176,
                  },
                  {
                    x: 2615,
                    y: 142,
                  },
                  {
                    x: 3661,
                    y: 48,
                  },
                  {
                    x: 4707,
                    y: 10,
                  },
                  {
                    x: 5753,
                    y: 1,
                  },
                  {
                    x: 6799,
                    y: 1,
                  },
                  {
                    x: 7845,
                    y: 0,
                  },
                  {
                    x: 8891,
                    y: 0,
                  },
                  {
                    x: 9937,
                    y: 1,
                  },
                ],
              },
            },
          },
        },
        description: 'Total number of people aged 18 to 39 inclusive.',
        property_group: 'age_demographics_ons.age_band_18_39',
      },
      {
        max: 55.6,
        min: 0.9,
        name: '% of people aged 18-39',
        type: 'percentage',
        label: '% of people in the age band 18-39',
        units: '%',
        source: 'ONS, NRS (2019)',
        details: ' Percentage of people aged 18 to 39 inclusive.',
        clip_max: 45.7,
        clip_min: 9.9,
        breakdown: [
          '% of people aged 0-17',
          '% of people aged 18-39',
          '% of people aged 40-64',
          '% of people aged 65+',
        ],
        precision: 1,
        aggregates: {
          GB: 27.5,
          Wales: 26.7,
          England: 27.5,
          Scotland: 27.8,
        },
        aggregation: 'mean',
        application: {
          orbis: {
            label: 'People in the age band 18-39',
            display: {
              color: 'viridis',
              colormap_type: 'neutral_sequential',
              colormap_reversed: false,
            },
            data_visualisation_components: {
              name: 'Bar',
              props: {
                data: [
                  {
                    x: 5,
                    y: 44,
                  },
                  {
                    x: 15,
                    y: 8237,
                  },
                  {
                    x: 25,
                    y: 21178,
                  },
                  {
                    x: 35,
                    y: 8922,
                  },
                  {
                    x: 45,
                    y: 1828,
                  },
                  {
                    x: 55,
                    y: 753,
                  },
                  {
                    x: 65,
                    y: 395,
                  },
                  {
                    x: 75,
                    y: 217,
                  },
                  {
                    x: 85,
                    y: 121,
                  },
                  {
                    x: 95,
                    y: 34,
                  },
                ],
              },
            },
          },
        },
        description: 'Percentage of people aged 18 to 39 inclusive.',
        property_group: 'age_demographics_ons.age_band_18_39',
      },
      {
        max: 1987,
        min: 0,
        name: 'people aged 40-64',
        type: 'continuous',
        label: 'Number of people in the age band 40-64',
        units: 'person',
        source: 'ONS, NRS (2019)',
        details: 'Total number of people aged 40 to 64 inclusive.',
        clip_max: 1238,
        clip_min: 159,
        breakdown: [
          'people aged 0-17',
          'people aged 18-39',
          'people aged 40-64',
          'people aged 65+',
        ],
        precision: 0,
        aggregates: {
          GB: 20639293,
          Wales: 999441,
          England: 17820056,
          Scotland: 1819796,
        },
        aggregation: 'sum',
        application: {
          orbis: {
            label: 'People in the age band 40-64',
            display: {
              color: 'viridis',
              colormap_type: 'neutral_sequential',
              colormap_reversed: false,
            },
            data_visualisation_components: {
              name: 'Bar',
              props: {
                data: [
                  {
                    x: 99.5,
                    y: 1460,
                  },
                  {
                    x: 298.5,
                    y: 7878,
                  },
                  {
                    x: 497.5,
                    y: 23601,
                  },
                  {
                    x: 696.5,
                    y: 7268,
                  },
                  {
                    x: 895.5,
                    y: 1236,
                  },
                  {
                    x: 1094.5,
                    y: 227,
                  },
                  {
                    x: 1293.5,
                    y: 48,
                  },
                  {
                    x: 1492.5,
                    y: 8,
                  },
                  {
                    x: 1691.5,
                    y: 0,
                  },
                  {
                    x: 1890.5,
                    y: 3,
                  },
                ],
              },
            },
          },
        },
        description: 'Total number of people aged 40 to 64 inclusive.',
        property_group: 'age_demographics_ons.age_band_40_64',
      },
      {
        max: 49.7,
        min: 0,
        name: '% of people aged 40-64',
        type: 'percentage',
        label: '% of people in the age band 40-64',
        units: '%',
        source: 'ONS, NRS (2019)',
        details: 'Percentage of people aged 40 to 64 inclusive.',
        clip_max: 45.8,
        clip_min: 14.8,
        breakdown: [
          '% of people aged 0-17',
          '% of people aged 18-39',
          '% of people aged 40-64',
          '% of people aged 65+',
        ],
        precision: 1,
        aggregates: {
          GB: 32.4,
          Wales: 31.9,
          England: 32.1,
          Scotland: 33.7,
        },
        aggregation: 'mean',
        application: {
          orbis: {
            label: 'People in the age band 40-64',
            display: {
              color: 'viridis',
              colormap_type: 'neutral_sequential',
              colormap_reversed: false,
            },
            data_visualisation_components: {
              name: 'Bar',
              props: {
                data: [
                  {
                    x: 2.5,
                    y: 42,
                  },
                  {
                    x: 7.5,
                    y: 123,
                  },
                  {
                    x: 12.5,
                    y: 256,
                  },
                  {
                    x: 17.5,
                    y: 467,
                  },
                  {
                    x: 22.5,
                    y: 1603,
                  },
                  {
                    x: 27.5,
                    y: 7907,
                  },
                  {
                    x: 32.5,
                    y: 19006,
                  },
                  {
                    x: 37.5,
                    y: 10787,
                  },
                  {
                    x: 42.5,
                    y: 1472,
                  },
                  {
                    x: 47.5,
                    y: 66,
                  },
                ],
              },
            },
          },
        },
        description: 'Percentage of people aged 40 to 64 inclusive.',
        property_group: 'age_demographics_ons.age_band_40_64',
      },
      {
        max: 1237,
        min: 0,
        name: 'people aged 65+',
        type: 'continuous',
        label: 'Number of people in the age band 65+',
        units: 'person',
        source: 'ONS, NRS (2019)',
        details: 'Total number of people aged 65+.',
        clip_max: 765.7,
        clip_min: 39,
        breakdown: [
          'people aged 0-17',
          'people aged 18-39',
          'people aged 40-64',
          'people aged 65+',
        ],
        precision: 0,
        aggregates: {
          GB: 12060237,
          Wales: 662376,
          England: 10353716,
          Scotland: 1044145,
        },
        aggregation: 'sum',
        application: {
          orbis: {
            label: 'People in the age band 65+',
            display: {
              color: 'viridis',
              colormap_type: 'neutral_sequential',
              colormap_reversed: false,
            },
            data_visualisation_components: {
              name: 'Bar',
              props: {
                data: [
                  {
                    x: 62,
                    y: 3974,
                  },
                  {
                    x: 186,
                    y: 14206,
                  },
                  {
                    x: 310,
                    y: 12968,
                  },
                  {
                    x: 434,
                    y: 7120,
                  },
                  {
                    x: 558,
                    y: 2415,
                  },
                  {
                    x: 682,
                    y: 774,
                  },
                  {
                    x: 806,
                    y: 205,
                  },
                  {
                    x: 930,
                    y: 46,
                  },
                  {
                    x: 1054,
                    y: 16,
                  },
                  {
                    x: 1178,
                    y: 5,
                  },
                ],
              },
            },
          },
        },
        description: 'Total number of people aged 65+.',
        property_group: 'age_demographics_ons.age_band_65_plus',
      },
      {
        max: 78.6,
        min: 0,
        name: '% of people aged 65+',
        type: 'percentage',
        label: '% of people in the age band 65+',
        units: '%',
        source: 'ONS, NRS (2019)',
        details: 'Percentage of people aged 65+',
        clip_max: 44.1,
        clip_min: 2.8,
        breakdown: [
          '% of people aged 0-17',
          '% of people aged 18-39',
          '% of people aged 40-64',
          '% of people aged 65+',
        ],
        precision: 1,
        aggregates: {
          GB: 19.4,
          Wales: 21.5,
          England: 19.2,
          Scotland: 19.7,
        },
        aggregation: 'mean',
        application: {
          orbis: {
            label: 'People in the age band 65+',
            display: {
              color: 'viridis',
              colormap_type: 'neutral_sequential',
              colormap_reversed: false,
            },
            data_visualisation_components: {
              name: 'Bar',
              props: {
                data: [
                  {
                    x: 4,
                    y: 2984,
                  },
                  {
                    x: 12,
                    y: 12512,
                  },
                  {
                    x: 20,
                    y: 14461,
                  },
                  {
                    x: 28,
                    y: 8837,
                  },
                  {
                    x: 36,
                    y: 2454,
                  },
                  {
                    x: 44,
                    y: 376,
                  },
                  {
                    x: 52,
                    y: 91,
                  },
                  {
                    x: 60,
                    y: 13,
                  },
                  {
                    x: 68,
                    y: 0,
                  },
                  {
                    x: 76,
                    y: 1,
                  },
                ],
              },
            },
          },
        },
        description: 'Percentage of people aged 65+',
        property_group: 'age_demographics_ons.age_band_65_plus',
      },
    ],
    provenance: {
      creator: 'sabine.lazuhina@astrosat.net',
      sources: [
        'https://www.nrscotland.gov.uk/statistics-and-data/statistics/statistics-by-theme/population/population-estimates/2011-based-special-area-population-estimates/small-area-population-estimates/time-series',
        'https://www.ons.gov.uk/peoplepopulationandcommunity/populationandmigration/populationestimates/datasets/lowersuperoutputareamidyearpopulationestimates',
      ],
      documentation: [
        'https://stevensonastrosat.sharepoint.com/:w:/r/sites/Projects/_layouts/15/Doc.aspx?sourcedoc=%7B94BE38B8-525D-4672-8B4C-4781590C6F29%7D&file=Age%20Demographics%20%E2%80%93%20ONS%202019.docx&action=default&mobileredirect=true',
      ],
    },
    application: {
      orbis: {
        layer: {
          name: 'CustomMVTLayer',
          props: {
            config: 'isolationPlusLayerConfig',
          },
        },
        categories: {
          name: 'Population',
          child: {
            name: 'Age',
          },
        },
        map_component: {
          name: 'IsolationPlusMapComponent',
        },
        sidebar_component: {
          name: 'RadioPicker',
        },
        orbs: [
          {
            name: 'ORBIS Core Datasets',
            description:
              'Astrosat Core Orb: all CustomerUsers should have a license for this.',
          },
        ],
      },
    },
    description:
      'Age demographics from the Office for National Statistics ONS 2019.',
    granularity: 'LSOA (average population 1500)',
    uniqueIdProperty: 'LSOA/DataZone Code',
  },
};

const state = {
  orbs: {
    isolationPlus: {
      colorSchemes: {},
      property: {
        source_id: 'astrosat/isolation_plus/age_ons/r3v1',
        max: 55.6,
        min: 0.9,
        name: '% of people aged 0-17',
        type: 'percentage',
        label: '% of people in the age band 0 - 17',
        units: '%',
        source: 'ONS, NRS (2019)',
        details: 'Percentage of people aged 17 and under.',
        clip_max: 36.3,
        clip_min: 5.3,
        breakdown: [
          '% of people aged 0-17',
          '% of people aged 18-39',
          '% of people aged 40-64',
          '% of people aged 65+',
        ],
        precision: 1,
        aggregates: {
          GB: 20.7,
          Wales: 19.9,
          England: 21.2,
          Scotland: 18.7,
        },
        aggregation: 'mean',
        application: {
          orbis: {
            label: 'People in the age band 0-17',
            display: {
              color: 'viridis',
              colormap_type: 'neutral_sequential',
              colormap_reversed: false,
            },
            data_visualisation_components: {
              name: 'Bar',
              props: {
                data: [
                  {
                    x: 3,
                    y: 266,
                  },
                  {
                    x: 9,
                    y: 1491,
                  },
                  {
                    x: 15,
                    y: 10520,
                  },
                  {
                    x: 21,
                    y: 19034,
                  },
                  {
                    x: 27,
                    y: 8342,
                  },
                  {
                    x: 33,
                    y: 1834,
                  },
                  {
                    x: 39,
                    y: 216,
                  },
                  {
                    x: 45,
                    y: 22,
                  },
                  {
                    x: 51,
                    y: 3,
                  },
                  {
                    x: 57,
                    y: 1,
                  },
                ],
              },
            },
          },
        },
        description: 'Percentage of people aged 17 and under.',
        property_group: 'age_demographics_ons.age_band_0_17',
      },
      filterRange: [0.9, 55.6],
    },
  },
};

const Index = {
  title: 'Orbs/Isolation Plus/Property Radio Group',
};

export default Index;

const Template = args => (
  <Provider store={mockStore(state)}>
    <IsolationPlusPropertyRadioGroup {...args} />
  </Provider>
);

export const Layer = Template.bind({});
Layer.args = {
  selectedLayer,
};

export const PairedOptionsLayer = Template.bind({});
PairedOptionsLayer.args = {
  selectedLayer,
};
