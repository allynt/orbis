import React, { useEffect, useState } from 'react';

import { VictoryChart, VictoryBar, VictoryAxis } from 'victory';

import { useChartTheme } from 'dashboard/useChartTheme';

const colorScale = {
  highPositive: {
    threshold: 15,
    color: '#7ef664',
  },
  mediumPositive: {
    threshold: 10,
    color: '#b3d567',
  },
  lowPositive: {
    threshold: 5,
    color: '#c7d99f',
  },
  neutral: {
    threshold: 0,
    color: '#d8c06a',
  },
  lowNegative: {
    threshold: -5,
    color: '#eda46c',
  },
  mediumNegative: {
    threshold: -10,
    color: '#f67971',
  },
  highNegative: {
    threshold: -15,
    color: '#f03b30',
  },
};

const getFill = ({ y }) => {
  if (y > -5 && y < 5) {
    return colorScale.neutral.color;
  }

  const color = Object.values(colorScale).reduce((prev, cur) => {
    if (y >= 0) {
      return cur.threshold < y ? cur : prev;
    } else {
      return cur.threshold < y ? cur : prev;
    }
  }).color;

  return color;
};

const BarChart = ({ chartData }) => (
  <VictoryBar
    data={chartData}
    style={{
      data: {
        fill: ({ datum }) => getFill(datum),
      },
    }}
  />
);

const GradientBarChart = ({ data, pad = 0 }) => {
  const [chartData, setChartData] = useState(
    data?.map(({ type }) => ({ x: type, y: 0 })),
  );
  const chartTheme = useChartTheme();

  // TODO: is ?? necessary?
  const dataValues =
    data?.map(({ value }) => (value < 0 ? value - value * 2 : value)) ?? [];

  const max = Math.max(...dataValues);

  useEffect(() => {
    setChartData(data?.map(({ type, value }) => ({ x: type, y: value })));
  }, []);

  return (
    <VictoryChart
      domainPadding={{ x: 15 }}
      animate={{ duration: 1000 }}
      theme={chartTheme}
    >
      <svg style={{ height: 0 }}>
        <defs>
          <linearGradient id="positive-gradient" gradientTransform="rotate(90)">
            <stop offset={'0%'} stopColor={'green'} />
            <stop offset={'50%'} stopColor={'orange'} />
            <stop offset={'100%'} stopColor={'yellow'} />
          </linearGradient>
        </defs>
      </svg>

      <svg style={{ height: 0 }}>
        <defs>
          <linearGradient id="negative-gradient" gradientTransform="rotate(90)">
            <stop offset={'0%'} stopColor={'yellow'} />
            <stop offset={'50%'} stopColor={'orange'} />
            <stop offset={'100%'} stopColor={'red'} />
          </linearGradient>
        </defs>
      </svg>
      <VictoryAxis tickFormat={() => ''} />
      <VictoryAxis
        dependentAxis
        domain={[-max - pad, max + pad]}
        tickFormat={tick => `${tick}%`}
      />
      {BarChart({ chartData })}
    </VictoryChart>
  );
};

export { GradientBarChart };
