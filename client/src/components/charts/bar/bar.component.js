import { ParentSize } from '@visx/responsive';
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
    <ParentSize>
      {({ width }) => {
        const padding = { left: 80, top: 20, bottom: 60, right: 0 },
          paddingY = padding.top + padding.bottom;

        return (
          <VictoryChart
            width={width}
            height={width * 0.7}
            theme={orbisChartTheme}
            padding={padding}
            domainPadding={{ x: width / data.length }}
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
              label={labelY}
              offsetX={padding.left}
              style={{
                axisLabel: { padding: padding.left - 14 },
                tickLabels: { padding: 10 },
              }}
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
