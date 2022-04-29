import React, { useEffect, useState } from 'react';

import { Skeleton, Typography, makeStyles } from '@astrosat/astrosat-ui';

import { VictoryChart, VictoryBar, VictoryAxis, VictoryLabel } from 'victory';

import {
  ChartWrapper,
  ChartWrapperSkeleton,
} from 'dashboard/charts/chart-wrapper.component';
import { StyledParentSize } from 'dashboard/charts/styled-parent-size.component';
import { useChartTheme } from 'dashboard/useChartTheme';
import FlyoutTooltip from 'dashboard/WalthamForest/FlyoutTooltip';

import { GRADIENT_STOPS } from '../../nature-scotland.constants';
import { NatureScotCustomLegend } from './impact-summary-legend.component';

const skeletonStyles = makeStyles(theme => ({
  legend: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: '0.5rem 0 0.5rem 0',
  },
}));

/**
 * @param {{ data: { category: string, score: number }[] }} props
 */
const ImpactSummary = ({ data }) => {
  const theme = useChartTheme();

  const [chartData, setChartData] = useState(
    data?.map(({ category }) => ({ x: category, y: 0 })),
  );

  useEffect(() => {
    if (!!data) {
      setChartData(
        data?.map(({ category, score }) => ({
          x: category,
          y: score === 0 ? 0.1 : score,
        })),
      );
    }
  }, [data]);

  return !!data ? (
    <ChartWrapper
      title="Impact Summary"
      info="This widget provides an overall summary of the impact of your proposal. "
    >
      <Typography>
        The chart below shows the overall impact of your proposal against five
        categories of impact. You may wish to reconsider aspects of your
        proposal where there is a high or medium negative impact.
      </Typography>
      <NatureScotCustomLegend />
      <StyledParentSize>
        {({ width }) => {
          const height = width / 1.778,
            scale = height / 1130;
          return (
            <>
              <svg style={{ height: 0 }}>
                <defs>
                  <linearGradient
                    id="gradient"
                    gradientUnits="userSpaceOnUse"
                    gradientTransform={`rotate(90) scale(${scale} 1)`}
                  >
                    {Object.entries(GRADIENT_STOPS).map(([perc, color]) => (
                      <stop key={perc} offset={perc} stopColor={color} />
                    ))}
                  </linearGradient>
                </defs>
              </svg>
              <VictoryChart
                domainPadding={{ x: 40, y: 25 }}
                padding={{ left: 0, top: 0, bottom: 95, right: 30 }}
                animate={{ duration: 1000, animationWhitelist: ['data'] }}
                theme={theme}
                width={width}
                height={height}
              >
                <VictoryAxis
                  offsetY={95}
                  tickLabelComponent={
                    <VictoryLabel angle={45} textAnchor="start" />
                  }
                  style={{
                    tickLabels: {
                      fontSize: 14,
                      fill: '#fff',
                      marginRight: '1rem',
                    },
                  }}
                />
                <VictoryAxis
                  dependentAxis
                  domain={[-3, 3]}
                  crossAxis={false}
                  tickFormat={() => ''}
                />
                <VictoryBar
                  data={chartData}
                  labelComponent={FlyoutTooltip()}
                  labels={({ datum: { y } }) => `Impact: ${y === 0.1 ? 0 : y}`}
                  style={{
                    data: {
                      fill: 'url(#gradient)',
                      width: 55,
                    },
                  }}
                />
              </VictoryChart>
            </>
          );
        }}
      </StyledParentSize>
    </ChartWrapper>
  ) : null;
};

export const ImpactSummarySkeleton = () => {
  const styles = skeletonStyles();

  return (
    <ChartWrapperSkeleton>
      <div className={styles.legend}>
        <Skeleton variant="rect" width={'50%'} height={'15rem'} />
      </div>
    </ChartWrapperSkeleton>
  );
};

export { ImpactSummary };
