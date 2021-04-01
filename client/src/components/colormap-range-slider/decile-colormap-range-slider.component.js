import React, { useEffect, useState } from 'react';
import {
  VictoryAxis,
  VictoryBrushContainer,
  VictoryGroup,
  VictoryHistogram,
  VictoryLabel,
} from 'victory';
import { ColorScale } from 'utils/ColorScale';

/** @typedef {{x: [any, any], y: [any, any]}} BrushDomain */

const data = new Array(10).fill(undefined).map((_, i) => ({ x: i }));

/**
 * @param {number} value
 * @param {[number, number]} domain
 */
const isInRange = (value, domain) =>
  value >= Math.floor(domain[0]) && value < domain[1];

/**
 * @param {import('./colormap-range-slider.component').DecileColorMapRangeSliderProps} props
 */
const DecileColorMapRangeSlider = ({
  value,
  brushStyle,
  color,
  handleStyle,
  height,
  padding,
  snap = true,
  tickLabelStyle,
  reversed,
  onChange,
}) => {
  const domain = value || [0, 10];
  const brushDomain = { x: domain, y: undefined };
  const colorScale = new ColorScale({ color, domain, reversed });

  /** @type {import('victory').VictoryHistogramProps['style']} */
  const histogramStyle = {
    data: {
      fill: ({ index }) =>
        isInRange(+index, brushDomain.x)
          ? colorScale.get(+index)
          : colorScale.get(+index),
      opacity: ({ index }) => (isInRange(+index, brushDomain.x) ? 1 : 0.3),
      stroke: 'none',
    },
  };

  /** @type {import('victory').VictoryBrushContainerProps['onBrushDomainChangeEnd']} */
  const handleBrushDomainChangeEnd = ({ x }) =>
    snap
      ? onChange([Math.floor(x[0] + 1), x[1] > 10 ? 10 : Math.ceil(x[1])])
      : onChange(x);

  return (
    <VictoryGroup
      padding={padding}
      containerComponent={
        <VictoryBrushContainer
          title="Decile ColorMap Range Slider"
          height={height}
          brushDimension="x"
          brushStyle={brushStyle}
          handleStyle={handleStyle}
          brushDomain={brushDomain}
          onBrushCleared={handleBrushDomainChangeEnd}
          onBrushDomainChangeEnd={handleBrushDomainChangeEnd}
        />
      }
    >
      <VictoryHistogram
        animate={{ duration: 150, onLoad: { duration: 0 } }}
        data={data}
        bins={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
        style={histogramStyle}
      />
      <VictoryAxis
        tickValues={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
        orientation="top"
        axisComponent={<></>}
        tickLabelComponent={
          <VictoryLabel
            style={{
              ...tickLabelStyle,
              opacity: ({ index }) =>
                isInRange(+index, brushDomain.x) ? 1 : 0.3,
            }}
            dx={-17}
          />
        }
      />
    </VictoryGroup>
  );
};

export default DecileColorMapRangeSlider;
