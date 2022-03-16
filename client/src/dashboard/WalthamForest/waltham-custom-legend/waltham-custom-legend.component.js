import React from 'react';

import { Grid, makeStyles } from '@astrosat/astrosat-ui';

const RATIOS = {
    legendContainer: 0.1125,
    squareIconSize: 0.03,
    fontSize: 0.025,
    lineIconWidth: 0.06,
    lineIconHeight: 0.005,
    iconSpacing: 0.015,
  },
  MAX_FONT_SIZE = 16;

const useStyles = makeStyles(theme => ({
  apiLegend: {
    width: 'fit-content',
    maxHeight: props => props.maxHeight,
  },
  userTarget: {
    width: '100%',
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
  const maxHeight = width * RATIOS.legendContainer,
    fontSize = width * RATIOS.fontSize,
    fontSizeLimit = fontSize < MAX_FONT_SIZE ? fontSize : MAX_FONT_SIZE,
    styles = useStyles({ maxHeight });

  return (
    <Grid container direction="column" justifyContent="space-between">
      <Grid
        item
        container
        direction="column"
        wrap="wrap"
        className={styles.apiLegend}
      >
        {apiLegendData?.map(({ name, color }) => {
          const legendItemMargin = width * RATIOS.iconSpacing;
          return (
            <Grid key={name} item container alignItems="center">
              {/* creates square with correct color */}
              <div
                style={{
                  width: width * RATIOS.squareIconSize,
                  height: width * RATIOS.squareIconSize,
                  backgroundColor: `${color}`,
                  marginRight: legendItemMargin,
                  marginLeft: legendItemMargin,
                  maxWidth: '1rem',
                  maxHeight: '1rem',
                }}
              />
              <span
                style={{
                  fontSize: fontSizeLimit,
                }}
              >
                {name}
              </span>
            </Grid>
          );
        })}
      </Grid>

      {!!targetLegendData ? (
        <Grid
          item
          container
          justifyContent="flex-end"
          alignItems="center"
          className={styles.userTarget}
        >
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
              fontSize: fontSizeLimit,
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
