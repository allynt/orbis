import { assign } from 'lodash';

// *
// * Colors
// *
const colors = [
  '#252525',
  '#525252',
  '#737373',
  '#969696',
  '#bdbdbd',
  '#d9d9d9',
  '#f0f0f0',
];

const primary = '#f6be00';
const white = '#ffffff';
const grey = '#d8d8d8';
// *
// * Typography
// *
const sansSerif = "'Open Sans', sans-serif";
const letterSpacing = 'normal';
const fontSize = 16;

// *
// * Layout
// *
const baseProps = {
  width: 500,
  height: 360,
  padding: { left: 80, bottom: 60, top: 10 },
  colorScale: colors,
  animate: true,
};

// *
// * Labels
// *
const baseLabelStyles = {
  fontFamily: sansSerif,
  fontSize,
  letterSpacing,
  padding: 10,
  fill: primary,
  stroke: 'transparent',
};

const centeredLabelStyles = assign({ textAnchor: 'middle' }, baseLabelStyles);
// *
// * Strokes
// *
const strokeLinecap = 'round';
const strokeLinejoin = 'round';

/** @type {import('victory').VictoryThemeDefinition} */
const theme = {
  axis: {
    style: {
      axis: {
        fill: 'transparent',
        stroke: white,
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
        stroke: grey,
        opacity: 0.13,
        strokeDasharray: 5,
        pointerEvents: 'painted',
      },
      ticks: {
        fill: 'transparent',
        size: 1,
        stroke: 'transparent',
      },
      tickLabels: assign(baseLabelStyles, { fill: white }),
    },
  },
  bar: assign(
    {
      style: {
        data: {
          fill: white,
          padding: 8,
          strokeWidth: 1,
          stroke: white,
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
          stroke: primary,
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
      stroke: white,
      strokeWidth: 1,
      fill: '#f0f0f0',
      pointerEvents: 'none',
    },
    flyoutPadding: 5,
    cornerRadius: 5,
    pointerLength: 10,
  },
};

export default theme;
