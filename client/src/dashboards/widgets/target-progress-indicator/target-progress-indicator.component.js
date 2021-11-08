import React from 'react';

import { makeStyles, Typography, Grid } from '@astrosat/astrosat-ui';

import { VictoryLabel, VictoryAnimation, VictoryPie } from 'victory';

import { InfoButtonTooltip } from 'components';

const useStyles = makeStyles(theme => ({
  container: {
    // get BC from UI library
    backgroundColor: '#3e4e56',
    width: 'fit-content',
    height: 'fit-content',
    borderRadius: theme.shape.borderRadius,
  },
  header: {
    padding: theme.spacing(3),
  },
  title: {
    maxWidth: '90%',
  },
  info: {
    height: '1rem',
    width: '1rem',
  },
}));

const CircularProgress = ({ target = {}, width = 400 }) => {
  const { name, progress } = target;
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
        padding={0}
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
      </VictoryAnimation>
    </svg>
  );
};

export const TargetProgressIndicator = ({ target, width }) => {
  const styles = useStyles({});
  if (!target) {
    return null;
  }
  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      className={styles.container}
    >
      <Grid
        item
        container
        justifyContent="space-between"
        alignItems="baseline"
        className={styles.header}
      >
        <Typography color="primary" className={styles.title}>
          {target.description}
        </Typography>
        <InfoButtonTooltip
          tooltipContent={target.description}
          iconButtonClassName={styles.info}
        />
      </Grid>
      <CircularProgress target={target} width={width} />
    </Grid>
  );
};
