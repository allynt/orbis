import React from 'react';

import { makeStyles } from '@astrosat/astrosat-ui';

import { ParentSize } from '@visx/responsive';
import { VictoryAnimation, VictoryPie } from 'victory';

const useStyles = makeStyles(theme => ({
  parentSize: {
    display: 'flex',
    justifyContent: 'center',
  },
  circle: {
    fill: theme.palette.background.default,
  },
  text: {
    fill: theme.palette.text.primary,
    '&$value': { fontSize: theme.typography.pxToRem(48) },
    '&$target': { fontSize: theme.typography.pxToRem(14) },
    '&$noTarget': { fontSize: theme.typography.pxToRem(16) },
  },
  value: {},
  target: {},
  noTarget: {},
}));

/**
 * @param {{
 * color: string,
 * chartData: {x: number, y: number}[],
 * renderCenterDisplay: (props: any) => React.ReactElement
 * }} props
 */
const ProgressIndicatorChart = ({ color, chartData, renderCenterDisplay }) => {
  const styles = useStyles({});
  return (
    <ParentSize className={styles.parentSize}>
      {({ width }) => {
        const halfWidth = width / 2,
          radius = halfWidth / 2,
          progressBarWidth = width / 20,
          bgCirlceRadius = radius - progressBarWidth / 2;

        return (
          <svg
            width={halfWidth}
            height={halfWidth}
            viewBox={`0 0 ${halfWidth} ${halfWidth}`}
          >
            <circle
              cx={radius}
              cy={radius}
              r={bgCirlceRadius > 0 ? bgCirlceRadius : 0}
              className={styles.circle}
            />
            <VictoryPie
              standalone={false}
              width={halfWidth}
              height={halfWidth}
              padding={0}
              data={chartData}
              innerRadius={radius - progressBarWidth}
              cornerRadius={progressBarWidth / 2}
              animate={{ duration: 1000 }}
              labels={() => null}
              style={{
                data: {
                  fill: ({ datum }) => (datum.x === 1 ? color : 'transparent'),
                },
              }}
            />
            <VictoryAnimation duration={1000}>
              {() =>
                renderCenterDisplay({
                  radius,
                  width,
                })
              }
            </VictoryAnimation>
          </svg>
        );
      }}
    </ParentSize>
  );
};

export { ProgressIndicatorChart };
