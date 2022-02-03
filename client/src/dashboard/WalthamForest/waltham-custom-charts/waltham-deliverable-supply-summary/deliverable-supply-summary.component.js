import React, { useMemo } from 'react';

import { VictoryBar, VictoryStack } from 'victory';

import { BaseChart } from 'dashboard/charts/base-chart/base-chart.component';
import { ChartWrapper } from 'dashboard/charts/chart-wrapper.component';
import { useChartTheme } from 'dashboard/useChartTheme';
import { WalthamCustomLegend } from 'dashboard/WalthamForest/waltham-custom-legend/waltham-custom-legend.component';
import { DeliverableSupplySummaryTypes } from 'dashboard/WalthamForest/waltham.constants';

const DeliverableSupplySummary = ({ data }) => {
  const chartTheme = useChartTheme();
  // The theme has a hard-coded value for stacked charts, but we want the
  // colours to be a different set. Therefore, I'm taking the theme and
  // overriding, the stacked colorScale setting here and passing it as as
  // a prop to the BaseChart.
  const updatedTheme = {
    ...chartTheme,
    stack: {
      colorScale: chartTheme.walthamChartColors.deliverableSupplySummary,
    },
  };

  const DeliverableSupplySummaryChartData = useMemo(
    () => data?.properties[0].data,
    [data],
  );

  const apiLegendData = DeliverableSupplySummaryTypes.map((range, i) => ({
    name: range,
    color: chartTheme.walthamChartColors.deliverableSupplySummary[i], // TODO: set up palette
  }));

  const DeliverableSupplySummaryLegend = width => {
    return <WalthamCustomLegend apiLegendData={apiLegendData} width={1024} />;
  };

  const renderStackedBarChart = width => {
    const barWidth = width / 20;
    const ranges = DeliverableSupplySummaryTypes;
    const x = 'Year';

    return !!DeliverableSupplySummaryChartData ? (
      <VictoryStack>
        {ranges?.map(range => (
          <VictoryBar
            key={range}
            data={DeliverableSupplySummaryChartData}
            x={x}
            y={range}
            style={{
              data: {
                width: barWidth,
              },
            }}
          />
        ))}
      </VictoryStack>
    ) : null;
  };

  return (
    <ChartWrapper
      title="Deliverable Supply Summary"
      info="Deliverable Supply Summary in Units"
    >
      <BaseChart
        yLabel="Number Of Units"
        xLabel="Financial Year"
        renderChart={renderStackedBarChart}
        renderLegend={DeliverableSupplySummaryLegend}
        theme={updatedTheme}
      />
    </ChartWrapper>
  );
};

export default DeliverableSupplySummary;
