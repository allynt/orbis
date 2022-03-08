import React, { useMemo, useState } from 'react';

import {
  ToggleButtonGroup,
  ToggleButton,
  makeStyles,
} from '@astrosat/astrosat-ui';

import { VictoryGroup, VictoryLine, VictoryScatter } from 'victory';

import { BaseChart } from 'dashboard/charts/base-chart/base-chart.component';
import { ChartWrapper } from 'dashboard/charts/chart-wrapper.component';
import { useChartTheme } from 'dashboard/useChartTheme';
import FlyoutTooltip from 'dashboard/WalthamForest/FlyoutTooltip';
import { WalthamCustomLegend } from 'dashboard/WalthamForest/waltham-custom-legend/waltham-custom-legend.component';
import { HOUSING_APPROVAL_DATA_TYPES } from 'dashboard/WalthamForest/waltham.constants';

import { lineDataTransformer } from '../../utils';
const useStyles = makeStyles(theme => ({
  wrapper: {
    height: 'fit-content',
  },
  toggleButtonGroup: {
    width: '40%',
    marginLeft: '60%',
    marginBottom: '-1rem',
  },
}));

const HousingApprovalsComponent = ({
  x = 'x',
  xLabel = '',
  yLabel = '',
  ranges = ['y'],
  data,
  settings,
  setDashboardSettings,
}) => {
  const { walthamChartColors } = useChartTheme();
  const styles = useStyles({});

  const [configuration, setConfiguration] = useState(
    settings?.approvalsGrantedDataType ?? HOUSING_APPROVAL_DATA_TYPES.monthly,
  );
  /**
   * @param {any} _
   * @param {string} newValue
   */
  const handleToggleClick = (_, newValue) => {
    setConfiguration(newValue);
    setDashboardSettings(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        approvalsGrantedDataType: newValue,
      },
    }));
  };

  const dataByType = useMemo(
    () =>
      lineDataTransformer(
        data?.find(p => {
          return p.name === configuration;
        })?.data,
      ),
    [data, configuration],
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
    if (!dataByType) return null;

    return (
      <VictoryGroup>
        {ranges?.map((range, i) => {
          const color = walthamChartColors.housingApproval[i],
            props = {
              data: dataByType,
              x,
              y: range,
            };

          return (
            <VictoryLine
              {...props}
              style={{ data: { stroke: color } }}
              key={range}
            />
          );
        })}
        {ranges?.map((range, i) => {
          const color = walthamChartColors.housingApproval[i],
            props = {
              data: dataByType,
              x,
              y: range,
            };

          return (
            <VictoryScatter
              key={range}
              {...props}
              style={{ data: { stroke: color } }}
              labelComponent={FlyoutTooltip()}
              labels={({ datum }) => {
                return ` ${datum._y}`;
              }}
            />
          );
        })}
      </VictoryGroup>
    );
  };

  return (
    <ChartWrapper
      title="No. of housing approvals granted over time"
      info="This shows the number of housing approvals granted over time"
      classes={{ paper: styles.wrapper }}
    >
      <ToggleButtonGroup
        size="small"
        value={configuration}
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
