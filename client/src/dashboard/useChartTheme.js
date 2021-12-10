import { alpha, useTheme } from '@astrosat/astrosat-ui';

import deepmerge from 'deepmerge';

// *
// * Colors
// *
const colors = [
  '#f6be00', // gold
  '#37e5d8', // cyan
  '#05c3ff', // blue
  '#75b7b2', // surf green
  '#d6ea69', // yellow
  '#8189f3', // purple
  '#d76781', // red
  '#ffa048', // orange
];

const walthamChartColors = {
  totalHousing: ['#37e5d8', '#8189f3'],
  tenureHousing: ['#37e5d8', '#75b7b2', '#adeab0', '#05c3ff', '#d6ea69'],
  housingApproval: ['#f6be00', '#af31d6'],
  progressionVsPlanning: ['#37e5d8', '#d6ea69', '#05c3ff'],
};

const baseProps = {
  colorScale: colors,
  animate: true,
};

const strokeLinecap = 'round';
const strokeLinejoin = 'round';

/**
 * @returns {import('victory').VictoryThemeDefinition & {colors: string[], walthamChartColors: object, fontSize: number}}
 */
export const useChartTheme = () => {
  const astrosatUiTheme = useTheme();

  const baseLabelStyles = {
    ...astrosatUiTheme.typography.body1,
    fontSize: 14,
    fill: astrosatUiTheme.palette.text.primary,
    stroke: 'transparent',
  };

  const centeredLabelStyles = deepmerge(baseLabelStyles, {
    textAnchor: 'middle',
  });

  const baseAxisStyles = {
    style: {
      axis: {
        fill: 'transparent',
        stroke: astrosatUiTheme.palette.text.primary,
        strokeWidth: 1,
        strokeLinecap,
        strokeLinejoin,
      },
      axisLabel: deepmerge(centeredLabelStyles, {
        padding: 40,
        fill: astrosatUiTheme.palette.primary.main,
      }),
      grid: {
        fill: 'none',
        strokeDasharray: 5,
        pointerEvents: 'painted',
      },
      ticks: {
        fill: 'transparent',
        size: 1,
        stroke: 'transparent',
      },
      tickLabels: deepmerge(baseLabelStyles, {
        padding: 10,
        fill: astrosatUiTheme.palette.text.primary,
      }),
    },
  };

  return {
    colors,
    walthamChartColors,
    fontSize: 14,
    independentAxis: deepmerge(baseAxisStyles, {
      style: {
        grid: {
          stroke: 'transparent',
        },
      },
    }),
    dependentAxis: deepmerge(baseAxisStyles, {
      style: {
        grid: {
          stroke: alpha(astrosatUiTheme.palette.text.disabled, 0.2),
        },
      },
    }),
    bar: deepmerge(baseProps, {
      style: {
        labels: baseLabelStyles,
      },
      barRatio: 0.8,
    }),
    chart: deepmerge(baseProps, {
      padding: { left: 80, top: 20, bottom: 60, right: 10 },
    }),
    stack: {
      // changed this from 'colors', so that colors match legend
      colorScale: walthamChartColors.tenureHousing,
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
    line: {
      style: {
        data: {
          stroke: astrosatUiTheme.palette.primary.main,
          strokeWidth: 2,
        },
      },
    },
    scatter: {
      style: {
        data: {
          stroke: astrosatUiTheme.palette.primary.dark,
          strokeWidth: 2,
          fill: astrosatUiTheme.palette.primary.main,
        },
      },
    },
  };
};
