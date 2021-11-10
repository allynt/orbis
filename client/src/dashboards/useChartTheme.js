import { alpha, useTheme } from '@astrosat/astrosat-ui';

import { assign } from 'lodash';
import { VictoryTheme } from 'victory';

// *
// * Colors
// *
const colors = [
  '#f6be00',
  '#37e5d8',
  '#05c3ff',
  '#75b7b2',
  '#d6ea69',
  '#8189f3',
  '#d76781',
  '#ffa048',
];

// *
// * Layout
// *
const baseProps = {
  colorScale: colors,
  animate: true,
};

// *
// * Strokes
// *
const strokeLinecap = 'round';
const strokeLinejoin = 'round';

/** @returns {import('victory').VictoryThemeDefinition & {colors: string[], fontSize: number}} */
export const useChartTheme = () => {
  const astrosatUiTheme = useTheme();

  const baseLabelStyles = {
    ...astrosatUiTheme.typography.body1,
    fontSize: 14,
    fill: astrosatUiTheme.palette.text.primary,
    stroke: 'transparent',
  };

  const centeredLabelStyles = assign({}, baseLabelStyles, {
    textAnchor: 'middle',
  });

  return {
    colors,
    fontSize: 14,
    axis: {
      style: {
        axis: {
          fill: 'transparent',
          stroke: astrosatUiTheme.palette.text.primary,
          strokeWidth: 1,
          strokeLinecap,
          strokeLinejoin,
        },
        axisLabel: assign({}, centeredLabelStyles, {
          padding: 40,
          fill: astrosatUiTheme.palette.primary.main,
        }),
        grid: {
          fill: 'none',
          stroke: alpha(astrosatUiTheme.palette.text.disabled, 0.2),
          strokeDasharray: 5,
          pointerEvents: 'painted',
        },
        ticks: {
          fill: 'transparent',
          size: 1,
          stroke: 'transparent',
        },
        tickLabels: assign({}, baseLabelStyles, {
          padding: 10,
          fill: astrosatUiTheme.palette.text.primary,
        }),
      },
    },
    bar: assign({}, baseProps, {
      style: {
        labels: baseLabelStyles,
      },
      barRatio: 0.8,
    }),
    chart: assign({}, baseProps, {
      padding: { left: 80, top: 20, bottom: 60, right: 10 },
    }),
    stack: {
      colorScale: colors,
    },
    legend: {
      colorScale: colors,
      style: {
        data: {
          borderRadius: 0,
        },
        labels: baseLabelStyles,
      },
    },
  };
};
