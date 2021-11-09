import React from 'react';

import { makeStyles } from '@astrosat/astrosat-ui';

import { ParentSize } from '@visx/responsive';
import { Text } from '@visx/text';
import clsx from 'clsx';
import { VictoryAnimation, VictoryPie } from 'victory';

const useStyles = makeStyles(theme => ({
  circle: {
    fill: theme.palette.background.default,
  },
  text: {
    fill: theme.palette.text.primary,
    fontWeight: 600,
    '&$value': { fontSize: 48 },
    '&$target': { fontSize: 14 },
    '&$noTarget': { fontSize: 16 },
  },
  value: {},
  target: {},
  noTarget: {},
}));

export const TargetProgressIndicator = ({ source }) => {
  const styles = useStyles({});

  if (!source) {
    return null;
  }

  const COLORS = {
    blue: '#37e5d8',
    green: '#d6ea69',
    yellow: '#ffb72e',
    red: '#f52455',
  };

  const { name, target, progress } = source;
  const percentage = Math.round((progress / target) * 100);
  const data = [
    { x: 1, y: percentage },
    { x: 2, y: 100 - percentage },
  ];

  const getColor = value => {
    if (value < 25) {
      return COLORS.blue;
    } else if (value < 50) {
      return COLORS.green;
    } else if (value < 75) {
      return COLORS.yellow;
    } else {
      return COLORS.red;
    }
  };

  return (
    <ParentSize>
      {({ width }) => {
        const radius = width / 2,
          progressBarWidth = 16;
        return (
          <svg width={width} height={width} viewBox={`0 0 ${width} ${width}`}>
            <circle
              cx={radius}
              cy={radius}
              r={radius - progressBarWidth / 2}
              className={styles.circle}
            />
            <VictoryPie
              standalone={false}
              width={width}
              height={width}
              padding={0}
              data={data}
              innerRadius={radius - progressBarWidth}
              cornerRadius={progressBarWidth / 2}
              animate={{ duration: 1000 }}
              labels={() => null}
              style={{
                data: {
                  fill: ({ datum }) => {
                    const color = getColor(datum.y);
                    return datum.x === 1 ? color : 'transparent';
                  },
                },
              }}
            />
            <VictoryAnimation duration={1000} data={percentage}>
              {newProps => {
                const isNumber =
                  typeof newProps === 'number' && !isNaN(newProps);
                return isNumber ? (
                  <>
                    <Text
                      width={radius}
                      textAnchor="middle"
                      verticalAnchor="end"
                      x={radius}
                      y={radius}
                      // ERROR
                      dy={-8}
                      className={clsx(styles.text, styles.value)}
                    >
                      {`${Math.round(newProps)}%`}
                    </Text>
                    <Text
                      width={radius}
                      textAnchor="middle"
                      verticalAnchor="start"
                      x={radius}
                      y={radius}
                      dy={8}
                      className={clsx(styles.text, styles.target)}
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
                    className={clsx(styles.text, styles.noTarget)}
                  >
                    {`${name} Target Required`}
                  </Text>
                );
              }}
            </VictoryAnimation>
          </svg>
        );
      }}
    </ParentSize>
  );
};
