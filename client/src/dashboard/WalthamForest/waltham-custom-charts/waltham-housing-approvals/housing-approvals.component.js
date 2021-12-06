import React, { useState, useMemo } from 'react';

import {
  ToggleButtonGroup,
  ToggleButton,
  makeStyles,
} from '@astrosat/astrosat-ui';

import { ChartWrapper } from 'dashboard/charts/chart-wrapper.component';
import { LineChart } from 'dashboard/charts/line-chart/line-chart.component';
import { useChartTheme } from 'dashboard/useChartTheme';
import { WalthamCustomLegend } from 'dashboard/WalthamForest/waltham-custom-legend/waltham-custom-legend.component';
import { HOUSING_APPROVAL_DATA_TYPES } from 'dashboard/WalthamForest/waltham.constants';

import { lineDataTransformer } from '../../utils';
const useStyles = makeStyles(theme => ({
  legendAndButtons: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttons: {
    width: '40%',
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
      name: '2019',
      color: walthamChartColors.housingApproval[0],
    },
    {
      name: '2020',
      color: walthamChartColors.housingApproval[1],
    },
  ];

  return (
    <ChartWrapper
      title="No. of housing approvals granted over time"
      info="This shows the number of housing approvals granted over time"
    >
      <div className={styles.legendAndButtons}>
        <WalthamCustomLegend apiLegendData={apiLegendData} />

        <ToggleButtonGroup
          size="small"
          value={selectedDataType}
          orientation="horizontal"
          onChange={handleToggleClick}
          className={styles.buttons}
        >
          <ToggleButton value={HOUSING_APPROVAL_DATA_TYPES.monthly}>
            {HOUSING_APPROVAL_DATA_TYPES.monthly}
          </ToggleButton>
          <ToggleButton value={HOUSING_APPROVAL_DATA_TYPES.cumulative}>
            {HOUSING_APPROVAL_DATA_TYPES.cumulative}
          </ToggleButton>
        </ToggleButtonGroup>
      </div>

      <LineChart
        x={x}
        ranges={ranges}
        xLabel={xLabel}
        yLabel={yLabel}
        data={dataByType}
      />
    </ChartWrapper>
  );
};

export { HousingApprovalsComponent };
