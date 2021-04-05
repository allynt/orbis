import * as React from 'react';

import { ParentSize } from '@visx/responsive';
import { Text } from '@visx/text';
import numeral from 'numeral';
import {
  Point,
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryGroup,
  VictoryLine,
  VictoryScatter,
} from 'victory';

import { useChartTheme } from 'hooks/useChartTheme';
import { ColorScale } from 'utils/ColorScale';
import { isRealValue } from 'utils/isRealValue';

const WrappingLabel = props => (
  <Text width={props.width} fontSize={14} {...props}>
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
 *   dependentScale?: 'linear' | 'log'
 * }} props
 */
export const Histogram = ({
  data,
  color,
  domain,
  clip,
  labelX,
  labelY,
  line,
  reversed = false,
  dependentScale = 'linear',
}) => {
  const orbisChartTheme = useChartTheme();
  const colorScale = new ColorScale({ color, domain, clip, reversed });
  const yValues = data?.map(d => d.y);
  return (
    <ParentSize>
      {({ width }) => {
        const padding = { left: 80, top: 20, bottom: 60, right: 10 },
          paddingY = padding.top + padding.bottom;

        return (
          <VictoryChart
            width={width}
            height={width * 0.7}
            theme={orbisChartTheme}
            padding={padding}
            domainPadding={{ x: width / data.length }}
            scale={{ y: dependentScale }}
          >
            <VictoryAxis
              fixLabelOverlap
              label={labelX}
              axisLabelComponent={<WrappingLabel width={width - paddingY} />}
              tickCount={3}
              crossAxis={false}
              style={{
                axisLabel: { padding: padding.bottom - 28 },
                tickLabels: { padding: 10 },
              }}
            />
            <VictoryAxis
              dependentAxis
              fixLabelOverlap
              crossAxis={false}
              tickCount={dependentScale === 'log' ? 4 : undefined}
              label={labelY}
              offsetX={padding.left}
              style={{
                axisLabel: { padding: padding.left - 14 },
                tickLabels: { padding: 10 },
              }}
              tickFormat={tick => {
                return dependentScale === 'log'
                  ? numeral(Number(tick).toLocaleString()).format('0 a')
                  : tick;
              }}
            />
            <VictoryBar
              data={data}
              style={{
                data: {
                  fill: ({ datum }) => colorScale.get(datum.x),
                },
              }}
              domain={{
                x: domain.map(Number),
                y: [
                  dependentScale === 'log' ? 0.3 : Math.min(...yValues),
                  Math.max(...yValues),
                ],
              }}
            />
            {isRealValue(line) ? (
              <VictoryGroup groupComponent={<g data-testid="line" />}>
                <VictoryLine
                  data={[
                    { x: line, y: dependentScale === 'log' ? 0.3 : 0 },
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
                    {
                      x: line,
                      y: Math.max(...yValues),
                      symbol: 'triangleDown',
                    },
                  ]}
                />
              </VictoryGroup>
            ) : null}
          </VictoryChart>
        );
      }}
    </ParentSize>
  );
};
