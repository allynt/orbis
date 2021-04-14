import React, { useState } from 'react';

import { Button, ButtonGroup, makeStyles } from '@astrosat/astrosat-ui';

import { ParentSize } from '@visx/responsive';
import clsx from 'clsx';
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
  notActive: {
    color: theme.palette.secondary.contrastText,
    backgroundColor: theme.palette.secondary.dark,
    cursor: 'pointer',
  },
}));

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
  const [scale, setScale] = useState('linear');
  const isLogScale = scale === 'log';
  const orbisChartTheme = useChartTheme();
  const styles = useStyles();
  const colorScale = new ColorScale({ color, domain, clip, reversed });
  const yValues = data?.map(d => d.y);

  return (
    <>
      <ButtonGroup className={styles.buttonGroup} size="small">
        <Button
          onClick={() => setScale('linear')}
          className={clsx({ [styles.notActive]: scale !== 'linear' })}
        >
          Linear
        </Button>
        <Button
          onClick={() => setScale('log')}
          className={clsx({ [styles.notActive]: scale !== 'log' })}
        >
          Log
        </Button>
      </ButtonGroup>
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
                  axisLabel: { padding: padding.bottom - 28 },
                  tickLabels: { padding: 10 },
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
                  axisLabel: { padding: padding.left - 14 },
                  tickLabels: { padding: 10 },
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
