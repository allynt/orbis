import React, { useState } from 'react';
import {
  VictoryAxis,
  VictoryBrushContainer,
  VictoryGroup,
  VictoryHistogram,
  VictoryLabel,
} from 'victory';
import chroma from 'chroma-js';

/** @typedef {{x: [any, any], y: [any, any]}} BrushDomain */

/**
 * @param {{
 *   color: ColorMap
 *   snap?: boolean
 *   onChange?: (domain: [number, number]) => void
 * } & import('./colormap-range-slider.component').SharedProps} props
 */
const DecileColorMapRangeSlider = ({
  brushStyle,
  color,
  handleStyle,
  tickLabelStyle,
}) => {
  /** @type {[number, number]} */
  const domain = [0, 10];
  /** @type {[BrushDomain, React.Dispatch<BrushDomain>]} */
  const [brushDomain, setBrushDomain] = useState({ x: domain, y: undefined });
  const colorScale = chroma.scale(color).domain(domain);
  const data = new Array(10).fill(undefined).map((_, i) => ({ x: i }));

  /** @type {import('victory').VictoryHistogramProps['style']} */
  const histogramStyle = {
    data: {
      fill: ({ index }) =>
        index >= Math.floor(brushDomain?.x[0]) && index <= brushDomain?.x[1]
          ? colorScale(+index).toString()
          : colorScale(+index)
              .alpha(0.3)
              .toString(),
      stroke: 'none',
    },
  };

  /** @type {import('victory').VictoryBrushContainerProps['onBrushDomainChangeEnd']} */
  const handleBrushDomainChangeEnd = domain => setBrushDomain(domain);

  return (
    <VictoryGroup
      containerComponent={
        <VictoryBrushContainer
          brushDimension="x"
          brushStyle={brushStyle}
          handleStyle={handleStyle}
          brushDomain={brushDomain}
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
                index >= Math.floor(brushDomain?.x[0]) &&
                index <= brushDomain?.x[1]
                  ? 1
                  : 0.3,
            }}
            dx={-17}
          />
        }
      />
    </VictoryGroup>
  );
};

export default DecileColorMapRangeSlider;
