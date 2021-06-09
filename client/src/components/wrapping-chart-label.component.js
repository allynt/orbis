import React from 'react';

import { Text } from '@visx/text';

export const WrappingChartLabel = props => (
  <Text width={props.width} fontSize={14} {...props}>
    {props.text}
  </Text>
);
