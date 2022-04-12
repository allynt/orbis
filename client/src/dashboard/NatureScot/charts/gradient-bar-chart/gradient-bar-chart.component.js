import React, { useEffect, useState } from 'react';

import { VictoryChart, VictoryBar, VictoryAxis, VictoryLabel } from 'victory';

import { StyledParentSize } from 'dashboard/charts/styled-parent-size.component';
import { useChartTheme } from 'dashboard/useChartTheme';

const stopsData = {
  '0%': '#7ef664',
  '30%': '#b3d567',
  '40%': '#c7d99f',
  '50%': '#d8c06a',
  '60%': '#eda46c',
  '70%': '#f67971',
  '100%': '#f03b30',
};

const GradientBarChart = ({ chartData }) => (
  <VictoryBar
    data={chartData}
    style={{
      data: {
        fill: 'url(#gradient)',
        width: 50,
      },
    }}
  />
);

const ImpactSummaryChart = ({ data }) => {
  const theme = useChartTheme();

  const [chartData, setChartData] = useState(
    data?.map(({ type }) => ({ x: type, y: 0 })),
  );

  useEffect(() => {
    setChartData(data?.map(({ type, impact }) => ({ x: type, y: impact })));
  }, []);

  return (
    <StyledParentSize>
      {({ width }) => (
        <>
          <svg style={{ height: 0 }}>
            <defs>
              <linearGradient
                id="gradient"
                gradientUnits="userSpaceOnUse"
                gradientTransform="rotate(90)"
              >
                {Object.entries(stopsData).map(([perc, color]) => (
                  <stop key={perc} offset={perc} stopColor={color} />
                ))}
              </linearGradient>
            </defs>
          </svg>
          <VictoryChart
            domainPadding={{ x: 40, y: 10 }}
            padding={{ left: 0, top: 0, bottom: 90, right: 0 }}
            animate={{ duration: 1000, animationWhitelist: ['data'] }}
            theme={theme}
            width={width}
            height={width / 1.778}
          >
            <VictoryAxis
              offsetY={90}
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
            {GradientBarChart({ chartData })}
          </VictoryChart>
        </>
      )}
    </StyledParentSize>
  );
};

export { ImpactSummaryChart };
