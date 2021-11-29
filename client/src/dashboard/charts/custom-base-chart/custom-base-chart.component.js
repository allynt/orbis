import React from 'react';

import { ParentSize } from '@visx/responsive';
import numeral from 'numeral';
import { VictoryAxis, VictoryChart } from 'victory';

import { useChartTheme } from '../../useChartTheme';

/**
 * @param {{
 *  xLabel?: string
 *  yLabel?: string
 *  renderChart: (width: number) => React.ReactNode
 * }} props
 */
const CustomBaseChart = ({ xLabel = '', yLabel = '', renderChart }) => {
  const chartTheme = useChartTheme();

  const getTickFormat = t => {
    return numeral(Number(t).toLocaleString()).format(
      `${t > 1000 ? '0.0' : '0'} a`,
    );
  };

  return (
    <ParentSize>
      {({ width }) => {
        return (
          <VictoryChart
            theme={chartTheme}
            width={width}
            height={width / 1.778}
            domainPadding={{ x: width * 0.1 }}
          >
            <VictoryAxis label={xLabel} />
            <VictoryAxis
              dependentAxis
              label={yLabel}
              tickFormat={getTickFormat}
            />
            {renderChart(width)}
          </VictoryChart>
        );
      }}
    </ParentSize>
  );
};

export { CustomBaseChart };
