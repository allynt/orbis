import { Text } from '@visx/text';
import * as React from 'react';
import { ColorScale } from 'utils/ColorScale';
import { isRealValue } from 'utils/isRealValue';
import {
  VictoryChart,
  VictoryBar,
  VictoryAxis,
  VictoryLine,
  Point,
  VictoryScatter,
  VictoryGroup,
} from 'victory';
import { useChartTheme } from '../useChartTheme';

const CustomLabel = props => (
  <Text width={400} {...props}>
    {props.text}
  </Text>
);

/**
 * @param {import('victory').PointProps} props
 */
const OffsetPoint = props => {
  return <Point {...props} y={props.y - +props.size} />;
};

/**
 * @param {{
 *   data: {x: number, y: number}[]
 *   color?: import('typings/orbis').ColorMap | string[]
 *   domain: [number, number]
 *   clip?: [number, number]
 *   labelX?: string
 *   labelY?: string
 *   line?: number
 *   reversed?: boolean
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
  reversed = false,
}) => {
  const orbisChartTheme = useChartTheme();
  const colorScale = new ColorScale({ color, domain, clip, reversed });
  const yValues = data?.map(d => d.y);
  return (
    <VictoryChart
      theme={orbisChartTheme}
      domain={{ x: domain.map(Number) }}
      domainPadding={{ x: 20, y: 10 }}
    >
      <VictoryAxis
        fixLabelOverlap
        label={labelX}
        axisLabelComponent={<CustomLabel />}
        tickCount={3}
        crossAxis={false}
        style={{ axisLabel: { padding: 50 } }}
      />
      <VictoryAxis
        dependentAxis
        fixLabelOverlap
        crossAxis={false}
        label={labelY}
        offsetX={150}
        style={{ axisLabel: { padding: 120 } }}
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
        <VictoryGroup groupComponent={<g data-testid="line" />}>
          <VictoryLine
            data={[
              { x: line, y: 0 },
              { x: line, y: Math.max(...yValues) },
            ]}
          />
          <VictoryScatter
            dataComponent={<OffsetPoint />}
            size={5}
            style={{
              data: {
                fill: orbisChartTheme.scatter.style.data.stroke,
              },
            }}
            data={[
              { x: line, y: Math.max(...yValues), symbol: 'triangleDown' },
            ]}
          />
        </VictoryGroup>
      ) : null}
    </VictoryChart>
  );
};
