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
  padding: { left: 80, bottom: 60, top: 10, right: 20 },
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
    fontSize: astrosatUiTheme.typography.fontSize,
    letterSpacing: 'normal',
    padding: 10,
    fill: astrosatUiTheme.palette.primary.main,
    stroke: 'transparent',
  };

  const centeredLabelStyles = assign({ textAnchor: 'middle' }, baseLabelStyles);

  return {
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
        tickLabels: assign(baseLabelStyles, {
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
        fontSize: 24,
        fill: astrosatUiTheme.palette.secondary.main,
      }),
      flyoutStyle: {
        strokeWidth: 0,
        fill: astrosatUiTheme.palette.primary.main,
        pointerEvents: 'none',
      },
      flyoutPadding: 10,
      cornerRadius: astrosatUiTheme.shape.borderRadius,
      pointerLength: 10,
    },
    pie: assign(
      {
        colorScale: colors,
        style: {
          data: {},
          labels: {
            fontWeight: astrosatUiTheme.typography.fontWeightBold,
            fontFamily: astrosatUiTheme.typography.fontFamily,
            fontSize: 24,
            fill: ({ index }) =>
              astrosatUiTheme.palette.getContrastText(
                colors[index % colors.length],
              ),
          },
        },
      },
      baseProps,
    ),
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
