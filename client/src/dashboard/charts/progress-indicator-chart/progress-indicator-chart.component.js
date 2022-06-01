import React, { useEffect, useState } from 'react';

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

// this prevents "Infinity%" values being shown, but calculates any
// valid values, including zero
const calculatePercentage = property => {
  const { target, progress } = property;
  let percentage = null;
  if (target >= 0 && (!!progress || progress === 0)) {
    percentage = target === 0 ? 100 : Math.round((progress / target) * 100);
  }

  return percentage;
};

const ProgressIndicatorChart = ({ property, color, formatCenterDisplay }) => {
  const styles = useStyles({});
  const [percentage, setPercentage] = useState(null);

  useEffect(() => {
    setPercentage(calculatePercentage(property));
  }, [percentage, property]);

  const data = [
    { x: 1, y: percentage ?? 0 },
    { x: 2, y: 100 - percentage ?? 0 },
  ];

  // TODO: magic numbers in <Text /> components

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
              data={data}
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
            <VictoryAnimation duration={1000} data={{ percentage }}>
              {({ percentage }) =>
                formatCenterDisplay({
                  percentage,
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
