import React from 'react';

import { VictoryLegend } from 'victory';

const WalthamCustomLegend = ({ apiLegendData, targetLegendData, width }) => {
  return (
    <div style={{ display: 'flex', width: '100%', height: '5rem' }}>
      <VictoryLegend
        orientation="vertical"
        data={apiLegendData}
        style={{
          labels: { fontSize: width / 10, fill: '#fff' },
        }}
      />

      {!!targetLegendData ? (
        <VictoryLegend
          orientation="vertical"
          data={targetLegendData}
          style={{
            labels: { fontSize: width / 10, fill: '#fff' },
          }}
        />
      ) : null}
    </div>
  );
};

export { WalthamCustomLegend };
