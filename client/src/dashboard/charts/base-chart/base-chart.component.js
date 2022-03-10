import React from 'react';

import { makeStyles } from '@astrosat/astrosat-ui';

import { ParentSize } from '@visx/responsive';
import numeral from 'numeral';
import { VictoryAxis, VictoryChart } from 'victory';

import { useChartTheme } from '../../useChartTheme';

const useStyles = makeStyles(theme => ({
  parentSize: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: 'inherit !important',
  },
}));

/**
 * @param {{
 *  xLabel?: string
 *  yLabel?: string
 *  renderChart: (width: number) => React.ReactNode
 *  renderLegend?: (width: number) => React.ReactNode
 *  financialYear?: boolean
 *  theme?: object
 * }} props
 */
const BaseChart = ({
  xLabel = '',
  yLabel = '',
  renderChart,
  renderLegend,
  financialYear = false,
  theme = {},
}) => {
  const chartTheme = { ...useChartTheme(), ...theme };

  const styles = useStyles({});

  const getXTickFormat = tick => {
    if (financialYear) {
      const year = Math.floor(tick);
      return [`${year}-`, `${year + 1}`];
    } else {
      return isNaN(Number(tick)) ? tick.toString() : tick;
    }
  };

  const getYTickFormat = tick =>
    numeral(Number(tick).toLocaleString()).format(
      `${tick > 1000 ? '0.0' : '0'} a`,
    );

  return (
    <ParentSize className={styles.parentSize}>
      {({ width }) => (
        <>
          {!!renderLegend ? renderLegend(width) : null}
          <VictoryChart
            theme={chartTheme}
            width={width}
            height={width / 1.778}
            domainPadding={{ x: width * 0.1 }}
          >
            <VictoryAxis label={xLabel} tickFormat={getXTickFormat} />
            <VictoryAxis
              dependentAxis
              label={yLabel}
              tickFormat={getYTickFormat}
              style={{
                axisLabel: { padding: 50 },
              }}
            />
            {!!width ? renderChart(width) : null}
          </VictoryChart>
        </>
      )}
    </ParentSize>
  );
};

export { BaseChart };
