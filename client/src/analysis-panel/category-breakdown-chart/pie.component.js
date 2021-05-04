import React from 'react';

import { useTheme } from '@astrosat/astrosat-ui';

import { VictoryLabel, VictoryPie } from 'victory';

import { useChartTheme } from 'hooks/useChartTheme';
import { DEFAULT_DECIMAL_PRECISION } from 'map/map.constants';
import { isSelected } from './category-breakdown-chart.component';

export const Pie = ({
  width,
  onSegmentClick,
  categoryList,
  selectedDatum,
  precision = DEFAULT_DECIMAL_PRECISION,
  clickedFeatures,
}) => {
  const chartTheme = useChartTheme();
  const theme = useTheme();

  const radiusModifier = width * 0.1,
    radiusSelected = width / 2,
    radius = radiusSelected - radiusModifier,
    radiusInner = width * 0.2,
    radiusLabelSelected = (radiusSelected + radiusInner) / 2,
    radiusLabel = (radius + radiusInner) / 2;

  /** @type {import('victory-core').VictoryStyleInterface} */
  const pieStyle = {
    data: {
      fill: ({ datum }) => datum.color,
      cursor: categoryList.length > 1 ? 'pointer' : 'default',
    },
    labels: {
      fontSize: 14,
      /** @type {import('victory-core').VictoryStringCallback} */
      fill: ({ datum }) => theme.palette.getContrastText(datum.color),
    },
  };

  /** @type {import('victory-core').VictoryNumberCallback} */
  const getRadius = ({ datum }) =>
    isSelected(datum, selectedDatum) ? radiusSelected : radius;

  /** @type {import('victory-core').VictoryStringCallback} */
  const getLabels = ({ datum }) => `${datum.percent.toFixed(precision)}%`;

  /** @param {import('victory').SliceProps} props */
  const getLabelRadius = ({ datum }) =>
    isSelected(datum, selectedDatum) ? radiusLabelSelected : radiusLabel;

  const labelText = `${!!selectedDatum ? `${selectedDatum?.count} / ` : ''}${
    clickedFeatures.length
  }\nArea${clickedFeatures.length > 1 ? 's' : ''}`;

  /** @type {import('victory-core').VictoryLabelStyleObject} */
  const labelStyle = {
    fill: theme.palette.text.primary,
    fontFamily: theme.typography.fontFamily,
    textAnchor: 'middle',
  };

  return (
    <svg width={width} height={width} viewBox={`0 0 ${width} ${width}`}>
      <VictoryPie
        events={[
          {
            target: 'data',
            eventHandlers: {
              onClick: (_, { datum }) => {
                onSegmentClick(datum);
                return [];
              },
            },
          },
        ]}
        width={width}
        height={width}
        padding={0}
        standalone={false}
        theme={chartTheme}
        animate={{
          onLoad: { duration: 500 },
          // @ts-ignore
          animationWhitelist: [
            'style',
            'data',
            'radius',
            'innerRadius',
            'labelRadius',
          ],
        }}
        data={categoryList || []}
        y="percent"
        x="percent"
        style={pieStyle}
        padAngle={2}
        innerRadius={radiusInner}
        radius={getRadius}
        labels={getLabels}
        labelRadius={getLabelRadius}
      />
      <VictoryLabel
        style={labelStyle}
        x={width / 2}
        y={width / 2}
        text={labelText}
      />
    </svg>
  );
};
