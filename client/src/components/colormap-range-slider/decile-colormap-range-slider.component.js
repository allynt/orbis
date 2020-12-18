import React, { useEffect, useState } from 'react';
import {
  VictoryAxis,
  VictoryBrushContainer,
  VictoryGroup,
  VictoryHistogram,
  VictoryLabel,
} from 'victory';
import { ColorScale } from 'utils/color';

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
  /** @type {[number, number]} */
  const domain = [0, 10];
  /** @type {[BrushDomain, React.Dispatch<BrushDomain>]} */
  const [brushDomain, setBrushDomain] = useState({ x: domain, y: undefined });
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

  useEffect(() => {
    // @ts-ignore
    if (onChange) onChange([brushDomain.x[0] + 1, brushDomain.x[1]]);
  }, [brushDomain]);

  /** @type {import('victory').VictoryBrushContainerProps['onBrushDomainChangeEnd']} */
  const handleBrushDomainChangeEnd = domain =>
    snap
      ? setBrushDomain({
          ...domain,
          x: [
            Math.floor(domain.x[0]),
            domain.x[1] > 10 ? 10 : Math.ceil(domain.x[1]),
          ],
        })
      : setBrushDomain(domain);

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
