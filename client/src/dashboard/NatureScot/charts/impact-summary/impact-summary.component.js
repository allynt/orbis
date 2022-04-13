import React, { useEffect, useState } from 'react';

import { Typography } from '@astrosat/astrosat-ui';

import { VictoryChart, VictoryBar, VictoryAxis, VictoryLabel } from 'victory';

import { ChartWrapper } from 'dashboard/charts/chart-wrapper.component';
import { StyledParentSize } from 'dashboard/charts/styled-parent-size.component';
import { useChartTheme } from 'dashboard/useChartTheme';

import { GRADIENT_STOPS } from '../../nature-scotland.constants';
import { NatureScotCustomLegend } from './impact-summary-legend.component';

/**
 * @param {{ data: { type: string, impact: number }[] }} props
 */
const ImpactSummary = ({ data }) => {
  const theme = useChartTheme();

  const [chartData, setChartData] = useState(
    data?.map(({ type }) => ({ x: type, y: 0 })),
  );

  useEffect(() => {
    if (!!data) {
      setChartData(data?.map(({ type, impact }) => ({ x: type, y: impact })));
    }
  }, [data]);

  return !!data ? (
    <ChartWrapper
      title="Impact Summary"
      info="This widget provides an overall summary of the impact of your proposal. "
    >
      <Typography>
        The chart below shows the overall impact of your proposal against eight
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
                padding={{ left: 0, top: 0, bottom: 95, right: 0 }}
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

export { ImpactSummary };
