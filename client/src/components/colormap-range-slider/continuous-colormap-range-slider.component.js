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
 * }} props
 */
const ContinuousColorMapRangeSlider = ({ color, domain }) => {
  const colorScale = chroma.scale(color);
  const scaleColors = colorScale.colors();
  const data = [{ x: 0.5, y: domain[1] }];
  const [clipPosition, setClipPosition] = useState(DEFAULT_CLIP_POSITION);

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
            style={{ fill: 'none' }}
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
          data={data}
          barWidth={200}
          domain={{ x: [0, 1], y: domain }}
          style={{
            data: {
              fill: 'url(#colorMapGradient)',
            },
          }}
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
          data={data}
          barWidth={200}
          domain={{ x: [0, 1], y: domain }}
          style={{
            data: {
              fill: 'url(#colorMapGradient)',
              opacity: 0.3,
            },
          }}
        />
      </VictoryGroup>
    </>
  );
};

export default ContinuousColorMapRangeSlider;
