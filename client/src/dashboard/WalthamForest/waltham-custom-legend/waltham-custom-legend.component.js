import React from 'react';

import { Grid, makeStyles } from '@astrosat/astrosat-ui';

const useStyles = makeStyles(theme => ({
  apiLegend: {
    width: 'fit-content',
    maxHeight: '5rem',
  },
  userTarget: {
    width: 'fit-content',
  },
}));

// TODO: use width for responsive sizing

/**
 * @param {{
 *  apiLegendData: { name: string, color: string }[]
 *  targetLegendData?: { name: string, color: string }
 *  width: number
 * }} props
 */
const WalthamCustomLegend = ({ apiLegendData, targetLegendData, width }) => {
  const styles = useStyles({});
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
            <Grid item container alignItems="center">
              {/* creates square with correct color */}
              <div
                style={{
                  width: '1rem',
                  height: '1rem',
                  backgroundColor: `${color}`,
                  marginRight: '1rem',
                }}
              />
              <span
                style={{
                  marginRight: '1rem',
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
              width: '3rem',
              height: '0.125rem',
              backgroundColor: `${targetLegendData.color}`,
              marginRight: '1rem',
            }}
          />
          <span>{targetLegendData.name}</span>
        </Grid>
      ) : null}
    </Grid>
  );
};

export { WalthamCustomLegend };
