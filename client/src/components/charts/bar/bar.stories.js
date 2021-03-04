import * as React from 'react';
import { BarChart } from './bar.component';

export default {
  title: 'Components/Charts/Bar',
  args: { color: 'Spectral', labelX: 'Stuff', labelY: 'Things' },
};

const Template = args => <BarChart {...args} />;

export const DecileData = Template.bind({});
DecileData.args = {
  domain: [1, 10],
  data: [
    {
      x: 1.0,
      y: 4172,
    },
    {
      x: 2.0,
      y: 4173,
    },
    {
      x: 3.0,
      y: 4173,
    },
    {
      x: 4.0,
      y: 4173,
    },
    {
      x: 5.0,
      y: 4173,
    },
    {
      x: 6.0,
      y: 4173,
    },
    {
      x: 7.0,
      y: 4173,
    },
    {
      x: 8.0,
      y: 4173,
    },
    {
      x: 9.0,
      y: 4173,
    },
    {
      x: 10.0,
      y: 4173,
    },
  ],
};

export const ContinuousData = Template.bind({});
ContinuousData.args = {
  domain: [134, 2546],
  data: [
    {
      x: 134.0,
      y: 15015,
    },
    {
      x: 402.0,
      y: 23278,
    },
    {
      x: 670.0,
      y: 2953,
    },
    {
      x: 938.0,
      y: 383,
    },
    {
      x: 1206.0,
      y: 70,
    },
    {
      x: 1474.0,
      y: 18,
    },
    {
      x: 1742.0,
      y: 8,
    },
    {
      x: 2010.0,
      y: 2,
    },
    {
      x: 2278.0,
      y: 1,
    },
    {
      x: 2546.0,
      y: 1,
    },
  ],
};

export const WithLine = Template.bind({});
WithLine.args = {
  ...ContinuousData.args,
  line: 1000,
};

export const DecileWithLine = Template.bind({});
DecileWithLine.args = {
  ...DecileData.args,
  line: 4,
};
