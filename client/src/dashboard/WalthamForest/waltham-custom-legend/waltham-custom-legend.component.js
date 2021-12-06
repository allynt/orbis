import React from 'react';

import { Grid, makeStyles } from '@astrosat/astrosat-ui';

const useStyles = makeStyles(theme => ({
  apiLegend: {
    width: 'fit-content',
    maxHeight: props => props.maxHeight,
  },
  userTarget: {
    width: 'fit-content',
  },
}));

/**
 * @param {{
 *  apiLegendData: { name: string, color: string }[]
 *  targetLegendData?: { name: string, color: string }
 *  width: number
 * }} props
 */
const WalthamCustomLegend = ({ apiLegendData, targetLegendData, width }) => {
  const maxHeight = width * 0.14;
  const styles = useStyles({ maxHeight });

  return (
    <Grid container justifyContent="space-between" alignItems="flex-start">
      <Grid
        item
        container
        direction="column"
        wrap="wrap"
        className={styles.apiLegend}
      >
        {apiLegendData?.map(({ name, color }) => {
          return (
            <Grid key={name} item container alignItems="center">
              {/* creates square with correct color */}
              <div
                style={{
                  width: width * 0.03,
                  height: width * 0.03,
                  backgroundColor: `${color}`,
                  marginRight: width * 0.03,
                }}
              />
              <span
                style={{
                  fontSize: width * 0.025,
                }}
              >
                {name}
              </span>
            </Grid>
          );
        })}
      </Grid>

      {!!targetLegendData ? (
        <Grid item container alignItems="center" className={styles.userTarget}>
          {/* creates line with correct color */}
          <div
            style={{
              width: width * 0.06,
              height: width * 0.005,
              backgroundColor: `${targetLegendData.color}`,
              marginRight: width * 0.015,
            }}
          />
          <span
            style={{
              fontSize: width * 0.025,
            }}
          >
            {targetLegendData.name}
          </span>
        </Grid>
      ) : null}
    </Grid>
  );
};

export { WalthamCustomLegend };
