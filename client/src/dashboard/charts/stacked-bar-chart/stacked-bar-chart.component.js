import React from 'react';

import { VictoryBar, VictoryStack } from 'victory';

/**
 * @param {{
 *  x: string
 *  ranges: string[]
 *  data: any[]
 *  width: number
 * }} props
 */
const StackedBarChart = ({ x = 'x', ranges = ['y'], data, width }) => {
  if (!data) return null;

  const barWidth = width / 20;
  return (
    <VictoryStack>
      {ranges?.map(range => (
        <VictoryBar
          key={range}
          data={data}
          x={x}
          y={range}
          style={{
            data: { width: barWidth },
          }}
        />
      ))}
    </VictoryStack>
  );
};

export { StackedBarChart };
