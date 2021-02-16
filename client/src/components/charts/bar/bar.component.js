import * as React from 'react';
import { ColorScale } from 'utils/ColorScale';
import { isRealValue } from 'utils/isRealValue';
import { VictoryChart, VictoryBar, VictoryAxis, VictoryLine } from 'victory';
import { useChartTheme } from '../useChartTheme';

/**
 * @param {{
 *   data: {x: number, y: number}[]
 *   color: import('typings/orbis').ColorMap | string[]
 *   domain: [number, number]
 *   clip?: [number, number]
 *   labelX?: string
 *   labelY?: string
 *   line?: number
 * }} props
 */
export const BarChart = ({
  data,
  color,
  domain,
  clip,
  labelX,
  labelY,
  line,
}) => {
  const orbisChartTheme = useChartTheme();
  const colorScale = new ColorScale({ color, domain, clip });
  const yValues = data?.map(d => d.y);
  return (
    <VictoryChart theme={orbisChartTheme} domain={{ x: domain.map(Number) }}>
      <VictoryAxis
        fixLabelOverlap
        label={labelX}
        tickCount={3}
        crossAxis={false}
        style={{ axisLabel: { padding: 50 } }}
      />
      <VictoryAxis
        dependentAxis
        fixLabelOverlap
        crossAxis={false}
        label={labelY}
        offsetX={120}
        style={{ axisLabel: { padding: 100 } }}
      />
      <VictoryBar
        data={data}
        style={{
          data: {
            fill: ({ datum }) => colorScale.get(datum.x),
          },
        }}
      />
      {isRealValue(line) ? (
        <VictoryLine
          data={[
            { x: line, y: 0 },
            { x: line, y: Math.max(...yValues) },
          ]}
        />
      ) : null}
    </VictoryChart>
  );
};
