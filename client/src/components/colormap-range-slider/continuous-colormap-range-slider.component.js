import React, { useEffect, useRef, useState } from 'react';
import {
  VictoryAxis,
  VictoryBar,
  VictoryBrushContainer,
  VictoryClipContainer,
  VictoryGroup,
  VictoryLabel,
} from 'victory';
import { isEqual } from 'lodash';
import { createColorScale } from 'utils/color';

const DEFAULT_CLIP_POSITION = {
  translateX: 0,
  clipWidth: 400,
};

/**
 * @param {import('./colormap-range-slider.component').ContinuousColorMapRangeSliderProps} props
 */
const ContinuousColorMapRangeSlider = ({
  brushStyle,
  color,
  domain = [0, 1],
  clip,
  value,
  handleStyle,
  height,
  padding,
  tickLabelStyle,
  precision = 0,
  reversed,
  onChange,
}) => {
  const brushRef = useRef();
  const colorScale = createColorScale({ color, domain, reversed, clip });
  const data = [{ x: 0.5, y: domain[1], y0: domain[0] }];
  const [brushDomain, setBrushDomain] = useState({ y: domain });
  const [clipPosition, setClipPosition] = useState(DEFAULT_CLIP_POSITION);

  const brushMoved = !isEqual(brushDomain.y, domain);

  useEffect(() => {
    const newValue =
      value === undefined || value?.some(v => v === undefined) ? domain : value;
    setBrushDomain({ y: newValue });
    if (brushRef.current) {
      const scaleY = brushRef?.current?.props.scale.y;
      setClipPosition(
        isEqual(newValue, domain)
          ? DEFAULT_CLIP_POSITION
          : {
              clipWidth: scaleY(newValue[1]) - scaleY(newValue[0]),
              translateX: scaleY(newValue[0]),
            },
      );
    }
  }, [domain, value]);

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
    tickFormat: t => t.toFixed(precision),
  };

  const handleBrushCleared = domain => {
    setBrushDomain(domain);
    setClipPosition(DEFAULT_CLIP_POSITION);
    if (onChange) onChange(domain.y);
  };

  const handleBrushDomainChange = (domain, { x1, x2 }) => {
    setBrushDomain(domain);
    setClipPosition({
      translateX: x2 > x1 ? x1 : x2,
      clipWidth: x2 > x1 ? x2 - x1 : x1 - x2,
    });
  };

  const handleBrushDomainChangeEnd = domain => {
    setBrushDomain(domain);
    if (onChange) onChange(brushDomain.y);
  };

  return (
    <div>
      <svg style={{ height: 0, width: 0, position: 'absolute' }}>
        <defs>
          <linearGradient id="colorMapGradient">
            {Array(domain[1] - domain[0])
              .fill(undefined)
              .map((_, i) => (
                <stop
                  key={i}
                  offset={`${(i / (domain[1] - domain[0])) * 100}%`}
                  stopColor={colorScale(domain[0] + i).toString()}
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
            ref={brushRef}
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
              translateX={clipPosition?.translateX}
              clipWidth={clipPosition?.clipWidth || 350}
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
    </div>
  );
};

export default ContinuousColorMapRangeSlider;
