import React from 'react';

import { Grid, makeStyles } from '@astrosat/astrosat-ui';

const MAX_FONT_SIZE = 16;

const RATIOS = {
  legendContainer: 0.14,
  squareIconSize: 0.03,
  fontSize: 0.025,
  lineIconWidth: 0.06,
  lineIconHeight: 0.005,
  iconSpacing: 0.015,
};

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
  const maxHeight = width * RATIOS.legendContainer;
  const fontSize = width * RATIOS.fontSize;
  const styles = useStyles({ maxHeight });

  return (
    <Grid container justifyContent="space-between" alignItems="flex-end">
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
                  width: width * RATIOS.squareIconSize,
                  height: width * RATIOS.squareIconSize,
                  backgroundColor: `${color}`,
                  marginRight: width * RATIOS.iconSpacing,
                  maxWidth: '1rem',
                  maxHeight: '1rem',
                }}
              />
              <span
                style={{
                  fontSize: fontSize < MAX_FONT_SIZE ? fontSize : MAX_FONT_SIZE,
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
              width: width * RATIOS.lineIconWidth,
              height: width * RATIOS.lineIconHeight,
              backgroundColor: `${targetLegendData.color}`,
              marginRight: width * RATIOS.iconSpacing,
            }}
          />
          <span
            style={{
              fontSize: width * RATIOS.fontSize,
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
