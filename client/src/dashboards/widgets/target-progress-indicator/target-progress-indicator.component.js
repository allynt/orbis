import React from 'react';

import { makeStyles } from '@astrosat/astrosat-ui';

import { ParentSize } from '@visx/responsive';
import { VictoryLabel, VictoryAnimation, VictoryPie } from 'victory';

const useStyles = makeStyles(theme => ({
  circle: {
    fill: theme.palette.background.default,
  },
}));

export const TargetProgressIndicator = ({ source }) => {
  const styles = useStyles({});

  const { name, target, progress } = source;

  let percentage = Math.round((progress / target) * 100);

  const data = [
    { x: 1, y: percentage },
    { x: 2, y: 100 - percentage },
  ];

  if (!source) {
    return null;
  }
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
                    const color = datum.y > 30 ? 'green' : 'red';
                    return datum.x === 1 ? color : 'transparent';
                  },
                },
              }}
            />
            {/* <VictoryAnimation duration={1000} data={percentage}>
        {newProps => {
          const isNumber = typeof newProps === 'number';
          return (
            <VictoryLabel
              textAnchor="middle"
              verticalAnchor="middle"
              x={200}
              y={200}
              text={
                isNumber
                  ? `${Math.round(newProps)}%`
                  : `${name} Target Required`
              }
              style={{ fontSize: 45, fill: '#fff' }}
            />
          );
        }}
      </VictoryAnimation> */}
          </svg>
        );
      }}
    </ParentSize>
  );
};
