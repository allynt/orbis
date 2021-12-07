import React, { useState, useMemo } from 'react';

import {
  ToggleButtonGroup,
  ToggleButton,
  makeStyles,
} from '@astrosat/astrosat-ui';

import { VictoryGroup, VictoryLine, VictoryScatter } from 'victory';

import { BaseChart } from 'dashboard/charts/base-chart/base-chart.component';
import { ChartWrapper } from 'dashboard/charts/chart-wrapper.component';
import { useChartTheme } from 'dashboard/useChartTheme';
import { WalthamCustomLegend } from 'dashboard/WalthamForest/waltham-custom-legend/waltham-custom-legend.component';
import { HOUSING_APPROVAL_DATA_TYPES } from 'dashboard/WalthamForest/waltham.constants';

import { lineDataTransformer } from '../../utils';
const useStyles = makeStyles(theme => ({
  toggleButtonGroup: {
    width: '40%',
    marginLeft: '60%',
    marginBottom: '-1rem',
  },
}));

const HousingApprovalsComponent = ({
  data,
  x = 'x',
  ranges = ['y'],
  xLabel = '',
  yLabel = '',
}) => {
  const { walthamChartColors } = useChartTheme();
  const styles = useStyles({});
  const [selectedDataType, setSelectedDataType] = useState(
    HOUSING_APPROVAL_DATA_TYPES.monthly,
  );

  const handleToggleClick = (_, newValue) => {
    if (!newValue) return;
    setSelectedDataType(newValue);
  };

  const dataByType = useMemo(
    () =>
      lineDataTransformer(data?.find(p => p.name === selectedDataType)?.data),
    [data, selectedDataType],
  );

  const apiLegendData = [
    {
      name: 'Actual 2019',
      color: walthamChartColors.housingApproval[0],
    },
    {
      name: 'Actual 2020',
      color: walthamChartColors.housingApproval[1],
    },
  ];

  const renderHousingApprovalsLegend = width => {
    return (
      <WalthamCustomLegend
        apiLegendData={apiLegendData}
        targetLegendData={null}
        width={width}
      />
    );
  };

  const renderLineChart = width => {
    return !!dataByType
      ? ranges?.map((range, i) => {
          const color = walthamChartColors.housingApproval[i],
            props = {
              data: dataByType,
              x,
              y: range,
            };
          return (
            <VictoryGroup key={range}>
              <VictoryLine {...props} style={{ data: { stroke: color } }} />
              <VictoryScatter {...props} style={{ data: { stroke: color } }} />
            </VictoryGroup>
          );
        })
      : null;
  };

  return (
    <ChartWrapper
      title="No. of housing approvals granted over time"
      info="This shows the number of housing approvals granted over time"
    >
      <ToggleButtonGroup
        size="small"
        value={selectedDataType}
        orientation="horizontal"
        onChange={handleToggleClick}
        className={styles.toggleButtonGroup}
      >
        <ToggleButton value={HOUSING_APPROVAL_DATA_TYPES.monthly}>
          {HOUSING_APPROVAL_DATA_TYPES.monthly}
        </ToggleButton>
        <ToggleButton value={HOUSING_APPROVAL_DATA_TYPES.cumulative}>
          {HOUSING_APPROVAL_DATA_TYPES.cumulative}
        </ToggleButton>
      </ToggleButtonGroup>

      <BaseChart
        xLabel={xLabel}
        yLabel={yLabel}
        renderChart={renderLineChart}
        renderLegend={renderHousingApprovalsLegend}
      />
    </ChartWrapper>
  );
};

export { HousingApprovalsComponent };
