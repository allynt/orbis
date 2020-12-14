import * as React from 'react';
import { VictoryChart, VictoryBar } from 'victory';

export const BarChart = ({ data }) => (
  <VictoryChart domainPadding={{ x: 12 }}>
    <VictoryBar data={data} cornerRadius={2} barRatio={0.8} />
  </VictoryChart>
);
