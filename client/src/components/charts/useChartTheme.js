import { fade, useTheme } from '@astrosat/astrosat-ui';
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
  width: 500,
  height: 360,
  padding: { left: 120, bottom: 100, top: 10, right: 40 },
  colorScale: colors,
  animate: true,
};

// *
// * Strokes
// *
const strokeLinecap = 'round';
const strokeLinejoin = 'round';

/** @returns {import('victory').VictoryThemeDefinition} */
export const useChartTheme = () => {
  const astrosatUiTheme = useTheme();

  const baseLabelStyles = {
    fontFamily: astrosatUiTheme.typography.fontFamily,
    fontSize: 24,
    letterSpacing: 'normal',
    padding: 10,
    fill: astrosatUiTheme.palette.text.primary,
    stroke: 'transparent',
  };

  const centeredLabelStyles = assign({ textAnchor: 'middle' }, baseLabelStyles);

  return {
    colors,
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
          padding: 35,
        }),
        grid: {
          fill: 'none',
          stroke: fade(astrosatUiTheme.palette.text.disabled, 0.2),
          strokeDasharray: 5,
          pointerEvents: 'painted',
        },
        ticks: {
          fill: 'transparent',
          size: 1,
          stroke: 'transparent',
        },
        tickLabels: assign({}, baseLabelStyles, {
          fill: astrosatUiTheme.palette.text.primary,
        }),
      },
    },
    bar: assign(
      {
        style: {
          data: {
            fill: astrosatUiTheme.palette.text.primary,
            padding: 8,
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
            strokeWidth: 5,
          },
          labels: baseLabelStyles,
        },
      },
      baseProps,
    ),
    tooltip: {
      style: assign({}, baseLabelStyles, { padding: 0, pointerEvents: 'none' }),
      flyoutStyle: {
        stroke: astrosatUiTheme.palette.text.primary,
        strokeWidth: 1,
        fill: '#f0f0f0',
        pointerEvents: 'none',
      },
      flyoutPadding: 5,
      cornerRadius: 5,
      pointerLength: 10,
    },
    pie: assign({}, baseProps, {
      animate: true,
      width: 400,
      height: 400,
      padding: 0,
      colorScale: colors,
      style: {
        data: {},
        labels: {
          textAnchor: 'middle',
          fontWeight: astrosatUiTheme.typography.fontWeightBold,
          fontFamily: astrosatUiTheme.typography.fontFamily,
          fontSize: 24,
          fill: ({ index }) =>
            astrosatUiTheme.palette.getContrastText(
              colors[index % colors.length],
            ),
        },
      },
    }),
    legend: {
      ...baseProps,
      height: 460,
      orientation: 'horizontal',
      y: 400,
      itemsPerRow: 4,
      gutter: 20,
      style: {
        labels: {
          ...baseLabelStyles,
        },
      },
    },
  };
};
