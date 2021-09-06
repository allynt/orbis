import React, { useState } from 'react';

import {
  makeStyles,
  ToggleButtonGroup,
  ToggleButton,
} from '@astrosat/astrosat-ui';

import { ParentSize } from '@visx/responsive';
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

import { WrappingChartLabel } from 'components';
import { useChartTheme } from 'hooks/useChartTheme';
import { ColorScale } from 'utils/ColorScale';
import { isRealValue } from 'utils/isRealValue';

const LOG_SCALE_MIN_DOMAIN = 0.3;

const SCALE_VALUES = {
  linear: 'Linear',
  log: 'log',
};

/**
 * @param {import('victory').PointProps} props
 */
const OffsetPoint = props => {
  return <Point {...props} y={props.y - +props.size / 2} />;
};

const useStyles = makeStyles(theme => ({
  buttonGroup: {
    margin: '0 auto',
    marginBottom: theme.spacing(2),
  },
  toggleButton: {
    minWidth: '5.125rem',
    padding: '0.5rem 1rem',
    fontSize: '0.875rem',
  },
}));

/**
 * @param {{
 *   data: {x: number, y: number}[]
 *   color?: import('typings').ColorMap | string[]
 *   domain: [number, number]
 *   clip?: [number, number]
 *   labelX?: string
 *   labelY?: string
 *   line?: number
 *   reversed?: boolean
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
}) => {
  const [scale, setScale] = useState(SCALE_VALUES.linear);
  const isLogScale = scale === SCALE_VALUES.log;
  const orbisChartTheme = useChartTheme();
  const styles = useStyles();
  const colorScale = new ColorScale({ color, domain, clip, reversed });
  const yValues = data?.map(d => d.y);

  const handleToggleClick = value => {
    if (scale === value) return;
    return setScale(value);
  };

  return (
    <>
      <ToggleButtonGroup className={styles.buttonGroup}>
        <ToggleButton
          onClick={() => handleToggleClick(SCALE_VALUES.linear)}
          selected={scale !== SCALE_VALUES.linear}
          className={styles.toggleButton}
        >
          {SCALE_VALUES.linear}
        </ToggleButton>
        <ToggleButton
          onClick={() => handleToggleClick(SCALE_VALUES.log)}
          selected={scale !== SCALE_VALUES.log}
          className={styles.toggleButton}
        >
          {SCALE_VALUES.log}
        </ToggleButton>
      </ToggleButtonGroup>

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
              scale={{ y: scale }}
            >
              <VictoryAxis
                fixLabelOverlap
                label={labelX}
                axisLabelComponent={
                  <WrappingChartLabel width={width - paddingY} />
                }
                tickCount={3}
                crossAxis={false}
                style={{
                  axisLabel: {
                    padding: padding.bottom - 28,
                    fontSize: orbisChartTheme.fontSize,
                  },
                  tickLabels: {
                    padding: 10,
                    fontSize: orbisChartTheme.fontSize,
                  },
                }}
              />
              <VictoryAxis
                dependentAxis
                fixLabelOverlap
                crossAxis={false}
                tickCount={isLogScale ? 4 : undefined}
                label={labelY}
                offsetX={padding.left}
                style={{
                  axisLabel: {
                    padding: padding.left - orbisChartTheme.fontSize,
                    fontSize: orbisChartTheme.fontSize,
                  },
                  tickLabels: {
                    padding: 10,
                    fontSize: orbisChartTheme.fontSize,
                  },
                }}
                tickFormat={tick => {
                  return isLogScale
                    ? numeral(Number(tick).toLocaleString()).format('0 a')
                    : tick;
                }}
              />
              <VictoryBar
                data={data}
                y={datum =>
                  isLogScale && datum.y < LOG_SCALE_MIN_DOMAIN
                    ? LOG_SCALE_MIN_DOMAIN
                    : datum.y
                }
                style={{
                  data: {
                    fill: ({ datum }) => colorScale.get(datum.x),
                  },
                }}
                domain={{
                  x: domain.map(Number),
                  y: [
                    isLogScale ? LOG_SCALE_MIN_DOMAIN : Math.min(...yValues),
                    Math.max(...yValues),
                  ],
                }}
              />
              {isRealValue(line) ? (
                <VictoryGroup groupComponent={<g data-testid="line" />}>
                  <VictoryLine
                    data={[
                      { x: line, y: isLogScale ? LOG_SCALE_MIN_DOMAIN : 0 },
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
    </>
  );
};
