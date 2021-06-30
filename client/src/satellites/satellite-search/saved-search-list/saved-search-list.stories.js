import React from 'react';

import SavedSearchList from './saved-search-list.component';

export default {
  title: 'Satellites/SatelliteSearch/SavedSearchList',
  argTypes: {
    setCurrentSearchQuery: { action: true },
    deleteSavedSatelliteSearch: { action: true },
  },
};

const Template = args => <SavedSearchList {...args} />;

export const Default = Template.bind({});
Default.args = {
  savedSearches: [
    {
      id: 1,
      name: 'NASA Landsat',
      satellites: ['landsat'],
      tiers: ['free'],
      start_date: '09-22-2018',
      end_date: '11-14-2018',
      aoi: [
        [-3.167660760641553, 55.99286861572247],
        [-2.903923859716656, 55.99286861572247],
        [-2.903923859716656, 55.845904872061936],
        [-3.167660760641553, 55.845904872061936],
        [-3.167660760641553, 55.99286861572247],
      ],
      owner: 1,
      created: '2020-03-02T10:00:18.622754Z',
    },
    {
      id: 2,
      name: 'Sentinel-2',
      satellites: ['sentinel-2'],
      tiers: ['mid'],
      start_date: '06-15-2016',
      end_date: '02-12-2016',
      aoi: [
        [-3.167660760641553, 55.99286861572247],
        [-2.903923859716656, 55.99286861572247],
        [-2.903923859716656, 55.845904872061936],
        [-3.167660760641553, 55.845904872061936],
        [-3.167660760641553, 55.99286861572247],
      ],
      owner: 1,
      created: '2020-03-02T10:00:18.622754Z',
    },
    {
      id: 1,
      name: 'MODIS',
      satellites: ['modis'],
      tiers: ['high'],
      start_date: '05-19-2017',
      end_date: '12-30-2017',
      aoi: [
        [-3.167660760641553, 55.99286861572247],
        [-2.903923859716656, 55.99286861572247],
        [-2.903923859716656, 55.845904872061936],
        [-3.167660760641553, 55.845904872061936],
        [-3.167660760641553, 55.99286861572247],
      ],
      owner: 1,
      created: '2020-03-02T10:00:18.622754Z',
    },
  ],
};
