import React from 'react';

import { makeStyles, Typography } from '@astrosat/astrosat-ui';

import { VictoryLabel, VictoryAnimation, VictoryPie } from 'victory';

const useStyles = makeStyles(theme => ({
  container: {
    // get BC from UI library
    backgroundColor: '#3e4e56',
    display: 'flex',
    flexDirection: 'column',
    width: 'fit-content',
    height: 'fit-content',
    borderRadius: theme.shape.borderRadius,
  },
  title: {},
}));

const CircularProgress = ({ progress, width = 400 }) => {
  const data = [
    { x: 1, y: progress },
    { x: 2, y: 100 - progress },
  ];
  return (
    <svg width={width} height={width} viewBox={`0 0 ${width} ${width}`}>
      <VictoryPie
        standalone={false}
        width={width}
        height={width}
        data={data}
        innerRadius={120}
        cornerRadius={25}
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
      <VictoryAnimation duration={1000} data={progress}>
        {newProps => {
          return (
            <VictoryLabel
              textAnchor="middle"
              verticalAnchor="middle"
              x={200}
              y={200}
              text={`${Math.round(newProps)}%`}
              style={{ fontSize: 45, fill: '#fff' }}
            />
          );
        }}
      </VictoryAnimation>
    </svg>
  );
};

export const TargetProgressIndicator = ({ progress, width }) => {
  const styles = useStyles({});
  return (
    <div className={styles.container}>
      <Typography color="primary" className={styles.title}>
        Title Goes Here
      </Typography>
      <CircularProgress progress={progress} width={width} />
    </div>
  );
};
