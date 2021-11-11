import React from 'react';

import { Widget } from '../widget-wrapper.component';
import { LineChart } from './line-chart.component';

export default {
  title: 'Dashboards/Widgets/Line Chart',
};

const Template = ({ source }) => {
  return (
    <Widget title={source?.title} info={source?.info}>
      <LineChart />
    </Widget>
  );
};

export const Default = Template.bind({});
