import React from 'react';

import { VictoryGroup, VictoryBar, VictoryLine, VictoryScatter } from 'victory';

import { BaseChart } from 'dashboard/charts/base-chart/base-chart.component';

const HousingTotalMultiChart = ({ apiData, userTargetData }) => {
  const renderHousingTotalMultiChart = width => {
    return <div>Hello</div>;
  };

  return (
    <BaseChart xLabel="" yLabel="" renderChart={renderHousingTotalMultiChart} />
  );
};

export { HousingTotalMultiChart };
