import { alpha, useTheme } from '@astrosat/astrosat-ui';

import { assign } from 'lodash';

// *
// * Colors
// *
const colors = [
  '#FABC31',
  '#42DC6E',
  '#F5170B',
  '#1F3EF0',
  '#F620C6',
  '#43CDF4',
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

  const centeredLabelStyles = assign({ textAnchor: 'middle' }, baseLabelStyles);

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
          fontStyle: 'italic',
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
          fill: alpha(astrosatUiTheme.palette.text.primary, 0.75),
        }),
      },
    },
    bar: assign(
      {
        style: {
          data: {
            fill: astrosatUiTheme.palette.text.primary,
            strokeWidth: 1,
            stroke: astrosatUiTheme.palette.text.primary,
          },
          labels: baseLabelStyles,
        },
        cornerRadius: 2,
        barRatio: 0.8,
      },
      baseProps,
    ),
    chart: baseProps,
    line: assign(
      {
        style: {
          data: {
            fill: 'transparent',
            stroke: astrosatUiTheme.palette.primary.main,
            strokeWidth: 3,
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
          },
          labels: baseLabelStyles,
        },
      },
      baseProps,
    ),
    tooltip: {
      style: assign({}, baseLabelStyles, {
        padding: 0,
        pointerEvents: 'none',
        fontWeight: astrosatUiTheme.typography.fontWeightBold,
        fontStyle: 'italic',
        fill: astrosatUiTheme.palette.secondary.main,
      }),
      flyoutStyle: {
        strokeWidth: 0,
        fill: astrosatUiTheme.palette.primary.main,
        pointerEvents: 'none',
      },
      flyoutPadding: 4,
      cornerRadius: astrosatUiTheme.shape.borderRadius,
      pointerLength: 8,
    },
    pie: assign({}, baseProps, {
      animate: true,
      colorScale: colors,
      style: {
        data: {},
        labels: assign({}, baseLabelStyles, {
          textAnchor: 'middle',
          fill: ({ index }) =>
            astrosatUiTheme.palette.getContrastText(
              colors[index % colors.length],
            ),
        }),
      },
    }),
    scatter: assign({}, baseProps, {
      style: {
        data: {
          fill: astrosatUiTheme.palette.common.white,
          stroke: astrosatUiTheme.palette.primary.main,
          strokeWidth: 2,
        },
      },
    }),
  };
};
