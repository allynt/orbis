import React from 'react';

import { VictoryTooltip } from 'victory';

import { walthamTooltip } from '../waltham.constants';

const WalthamTooltip = () => {
  const stroke = walthamTooltip.stroke;
  const color = walthamTooltip.color;
  return (
    <VictoryTooltip
      dy={0}
      centerOffset={{ x: 25 }}
      pointerWidth={0}
      flyoutHeight={40}
      flyoutWidth={120}
      constrainToVisibleArea
      flyoutStyle={{
        stroke: stroke,
        fill: color,
      }}
    />
  );
};

export default WalthamTooltip;
