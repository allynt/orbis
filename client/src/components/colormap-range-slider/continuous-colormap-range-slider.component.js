import React, { useState, useEffect } from 'react';
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
 *   units?: string
 *   domain?: [number, number]
 * } & import('./colormap-range-slider.component').SharedProps} props
 */
const ContinuousColorMapRangeSlider = ({
  brushStyle,
  color,
  domain = [0, 1],
  value,
  handleStyle,
  height,
  padding,
  tickLabelStyle,
  onChange,
}) => {
  const scaleColors = chroma.scale(color).colors();
  const data = [{ x: 0.5, y: domain[1] }];

  const [clipPosition, setClipPosition] = useState(value.clipPosition);
  const [brushDomain, setBrushDomain] = useState({ y: value.filterRange });

  const brushMoved = clipPosition !== DEFAULT_CLIP_POSITION;

  useEffect(() => {
    setClipPosition(value.clipPosition);
    setBrushDomain({ y: value.filterRange });
  }, [value]);

  /** @type {import('victory').VictoryBarProps} */
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

  const handleBrushCleared = () => {
    setClipPosition(DEFAULT_CLIP_POSITION);
    if (onChange) onChange(value);
  };

  const handleBrushDomainChange = (domain, { x1, x2 }) => {
    setBrushDomain(domain);
    setClipPosition({
      translateX: x2 > x1 ? x1 : x2,
      clipWidth: x2 > x1 ? x2 - x1 : x1 - x2,
    });
  };

  const handleBrushDomainChangeEnd = () => {
    const data = {
      filterRange: brushDomain.y.map(v => +v.toFixed(1)),
      clipPosition: clipPosition,
    };
    if (onChange) onChange(data);
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
            title="Continuous ColorMap Range Slider"
            height={height}
            brushDimension="y"
            brushDomain={brushDomain}
            brushStyle={brushStyle}
            handleStyle={handleStyle}
            onBrushCleared={handleBrushCleared}
            onBrushDomainChange={handleBrushDomainChange}
            onBrushDomainChangeEnd={handleBrushDomainChangeEnd}
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
          tickValues={brushMoved && brushDomain.y}
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
