import React, { useState } from 'react';
import chroma from 'chroma-js';
import {
  VictoryBar,
  VictoryBrushContainer,
  VictoryClipContainer,
  VictoryGroup,
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
}) => {
  const colorScale = chroma.scale(color);
  const scaleColors = colorScale.colors();
  const data = [{ x: 0.5, y: domain[1] }];
  const [clipPosition, setClipPosition] = useState(DEFAULT_CLIP_POSITION);

  /** @type {{
   *   data: typeof data
   *   barWidth: number
   *   domain: {x: [number, number], y: [number, number]}
   *   style: import('victory').VictoryBarProps['style']
   * }} */
  const barProps = {
    data,
    barWidth: 200,
    domain: { x: [0, 1], y: domain },
    style: {
      data: {
        fill: 'url(#colorMapGradient)',
      },
    },
  };

  return (
    <>
      <svg style={{ height: 0 }}>
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
        containerComponent={
          <VictoryBrushContainer
            brushDimension="y"
            brushStyle={brushStyle}
            handleStyle={handleStyle}
            onBrushCleared={() => setClipPosition(DEFAULT_CLIP_POSITION)}
            onBrushDomainChange={(_, props) => {
              setClipPosition({
                translateX: props.x2 > props.x1 ? props.x1 : props.x2,
                clipWidth:
                  props.x2 > props.x1
                    ? props.x2 - props.x1
                    : props.x1 - props.x2,
              });
            }}
          />
        }
      >
        <VictoryBar
          {...barProps}
          groupComponent={
            <VictoryClipContainer
              clipHeight={200}
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
      </VictoryGroup>
    </>
  );
};

export default ContinuousColorMapRangeSlider;
