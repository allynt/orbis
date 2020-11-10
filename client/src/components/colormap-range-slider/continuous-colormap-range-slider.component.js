import React, { useState } from 'react';
import chroma from 'chroma-js';
import {
  VictoryAxis,
  VictoryBar,
  VictoryBrushContainer,
  VictoryClipContainer,
  VictoryGroup,
  VictoryLabel,
} from 'victory';

const DEFAULT_CLIP_POSITION = {
  translateX: 0,
  clipWidth: 400,
};

/**
 * @param {{
 *   color: ColorMap
 *   units?: string
 *   domain?: [number, number]
 *   onChange?: (domain: [number, number]) => void
 * } & import('./colormap-range-slider.component').SharedProps} props
 */
const ContinuousColorMapRangeSlider = ({
  brushStyle,
  color,
  domain,
  handleStyle,
  height,
  padding,
  tickLabelStyle,
}) => {
  const scaleColors = chroma.scale(color).colors();
  const data = [{ x: 0.5, y: domain[1] }];
  const [clipPosition, setClipPosition] = useState(DEFAULT_CLIP_POSITION);
  const brushMoved = clipPosition !== DEFAULT_CLIP_POSITION;
  const [brushDomain, setBrushDomain] = useState({ y: domain });

  /** @type {import('victory').VictoryBarProps['style']} */
  const barProps = {
    // @ts-ignore
    data,
    barWidth: 85,
    domain: { x: [0, 1], y: domain },
    style: {
      data: {
        fill: 'url(#colorMapGradient)',
      },
    },
  };

  /** @type {import('victory').VictoryAxisProps} */
  const axisProps = {
    dependentAxis: true,
    orientation: 'top',
    axisComponent: <></>,
    tickFormat: t => t.toFixed(0),
  };

  const handleBrushDomainChange = (domain, { x1, x2 }) => {
    setBrushDomain(domain);
    setClipPosition({
      translateX: x2 > x1 ? x1 : x2,
      clipWidth: x2 > x1 ? x2 - x1 : x1 - x2,
    });
  };

  return (
    <>
      <svg style={{ height: 0, width: 0, position: 'absolute' }}>
        <defs>
          <linearGradient id="colorMapGradient">
            {scaleColors.map((color, i) => (
              <stop
                key={color.toString()}
                offset={`${(i / scaleColors.length) * 100}%`}
                stopColor={color.toString()}
              />
            ))}
          </linearGradient>
        </defs>
      </svg>
      <VictoryGroup
        horizontal
        padding={padding}
        containerComponent={
          <VictoryBrushContainer
            height={height}
            brushDimension="y"
            brushStyle={brushStyle}
            handleStyle={handleStyle}
            onBrushCleared={() => setClipPosition(DEFAULT_CLIP_POSITION)}
            onBrushDomainChange={handleBrushDomainChange}
          />
        }
      >
        <VictoryBar
          {...barProps}
          groupComponent={
            <VictoryClipContainer
              clipHeight={height}
              translateX={
                clipPosition.clipWidth === 0 ? 0 : clipPosition.translateX
              }
              clipWidth={clipPosition.clipWidth || 350}
            />
          }
        />
        <VictoryBar
          {...barProps}
          style={{
            ...barProps.style,
            data: {
              ...barProps.style.data,
              opacity: 0.3,
            },
          }}
        />
        <VictoryAxis
          {...axisProps}
          tickLabelComponent={
            <VictoryLabel
              style={{
                ...tickLabelStyle,
                opacity: brushMoved ? 0 : 1,
              }}
            />
          }
        />
        <VictoryAxis
          {...axisProps}
          tickValues={brushMoved && [brushDomain.y[0], brushDomain.y[1]]}
          tickLabelComponent={
            <VictoryLabel
              dx={({ index, text }) => {
                if (!brushMoved) return undefined;
                return index === 0
                  ? `${-text[0].length / 2}ch`
                  : `${text[0].length / 2}ch`;
              }}
              style={{
                ...tickLabelStyle,
                opacity: brushMoved ? 1 : 0,
              }}
            />
          }
        />
      </VictoryGroup>
    </>
  );
};

export default ContinuousColorMapRangeSlider;
