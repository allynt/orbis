import React from 'react';

import { groupedDataTransformer } from '../../WalthamForest/utils';
import { GroupedBarChart } from './grouped-bar-chart.component';

const data = [
  {
    Year: '2014-2015',
    'Total Gross': 743,
    'Total Net': 677,
  },
  {
    Year: '2015-2016',
    'Total Gross': 1089,
    'Total Net': 901,
  },
  {
    Year: '2016-2017',
    'Total Gross': 1114,
    'Total Net': 997,
  },
  {
    Year: '2017-2018',
    'Total Gross': 1331,
    'Total Net': 1103,
  },
  {
    Year: '2018-2019',
    'Total Gross': 1349,
    'Total Net': 1211,
  },
  {
    Year: '2019-2020',
    'Total Gross': 1468,
    'Total Net': 1032,
  },
  {
    Year: '2020-2021',
    'Total Gross': 907,
    'Total Net': 899,
  },
];

export default {
  title: 'Dashboard/Charts/Grouped Bar Chart',
};

const Template = args => <GroupedBarChart {...args} />;

export const Default = Template.bind({});
Default.args = {
  xLabel: 'Year',
  yLabel: 'Mock Data for Total Housing Delivery Graph',
  data: groupedDataTransformer(data),
};
