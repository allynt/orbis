import React from 'react';

import { makeStyles } from '@astrosat/astrosat-ui';

import { ParentSize } from '@visx/responsive';
import { Text } from '@visx/text';
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

const ProgressIndicatorChart = ({ property, color }) => {
  const styles = useStyles({});

  if (!property) {
    return null;
  }

  const { name, target, progress } = property;

  // this prevents "Infinity%" values being shown, but calculates any
  // valid values, including zero
  let percentage = null;
  if (target >= 0 && progress !== undefined && progress !== null) {
    percentage = target === 0 ? 100 : Math.round((progress / target) * 100);
  }

  const data =
    percentage === null
      ? null
      : [
          { x: 1, y: percentage },
          { x: 2, y: 100 - percentage },
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
              {newProps =>
                data ? (
                  <>
                    <Text
                      width={radius}
                      textAnchor="middle"
                      verticalAnchor="end"
                      x={radius}
                      y={radius}
                      dy={-8}
                      style={{
                        fill: '#fff',
                        fontSize: `${width / 150}rem`,
                      }}
                    >
                      {`${Math.round(Number(newProps.percentage))}%`}
                    </Text>
                    <Text
                      width={radius}
                      textAnchor="middle"
                      verticalAnchor="start"
                      x={radius}
                      y={radius}
                      dy={8}
                      style={{
                        fill: '#fff',
                        fontSize: `${width / 400}rem`,
                      }}
                    >
                      {`Target ${target} Units`}
                    </Text>
                  </>
                ) : (
                  <Text
                    width={radius}
                    textAnchor="middle"
                    verticalAnchor="middle"
                    x={radius}
                    y={radius}
                    style={{
                      fill: '#fff',
                      fontSize: `${width / 250}rem`,
                    }}
                  >
                    {`${name} Target Required`}
                  </Text>
                )
              }
            </VictoryAnimation>
          </svg>
        );
      }}
    </ParentSize>
  );
};

export { ProgressIndicatorChart };
