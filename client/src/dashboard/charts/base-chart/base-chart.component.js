import React from 'react';

import { ParentSize } from '@visx/responsive';
import numeral from 'numeral';
import { VictoryAxis, VictoryChart, VictoryLabel } from 'victory';

import { useChartTheme } from '../../useChartTheme';

/**
 * @param {{
 *  xLabel?: string
 *  yLabel?: string
 *  renderChart: (width: number) => React.ReactNode
 *  renderLegend?: (width: number) => React.ReactNode
 * }} props
 */
const BaseChart = ({ xLabel = '', yLabel = '', renderChart, renderLegend }) => {
  const chartTheme = useChartTheme();

  const getYTickFormat = t =>
    numeral(Number(t).toLocaleString()).format(`${t > 1000 ? '0.0' : '0'} a`);

  return (
    <ParentSize>
      {({ width }) => (
        <>
          {!!renderLegend ? renderLegend(width) : null}
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
              tickFormat={getYTickFormat}
            />
            {!!width ? renderChart(width) : null}
          </VictoryChart>
        </>
      )}
    </ParentSize>
  );
};

export { BaseChart };
