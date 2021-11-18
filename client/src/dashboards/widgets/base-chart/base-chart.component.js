import React from 'react';

import { ParentSize } from '@visx/responsive';
import numeral from 'numeral';
import { VictoryAxis, VictoryChart } from 'victory';

import { useChartTheme } from '../../useChartTheme';

/**
 * @param {{
 *  xLabel?: string
 *  yLabel?: string
 *  renderWidget: (width: number) => React.ReactNode
 * }} props
 */
const BaseChart = ({ xLabel = '', yLabel = '', renderWidget }) => {
  const chartTheme = useChartTheme();
  return (
    <ParentSize>
      {({ width }) => (
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
            tickFormat={t =>
              numeral(Number(t).toLocaleString()).format(
                `${t > 1000 ? '0.0' : '0'} a`,
              )
            }
          />
          {renderWidget(width)}
        </VictoryChart>
      )}
    </ParentSize>
  );
};

export { BaseChart };
