import React, { useState } from 'react';

import { Grid, Select, MenuItem } from '@astrosat/astrosat-ui';

import { VictoryBar, VictoryStack } from 'victory';

import { BaseChart } from 'dashboard/charts/base-chart/base-chart.component';
import { ChartWrapper } from 'dashboard/charts/chart-wrapper.component';
import { StyledParentSize } from 'dashboard/charts/styled-parent-size.component';
import { useChartTheme } from 'dashboard/useChartTheme';
import FlyoutTooltip from 'dashboard/WalthamForest/FlyoutTooltip';
import { labelsForArrayOfObjectsInclusive } from 'dashboard/WalthamForest/tooltips-utils';
import { filterByType } from 'dashboard/WalthamForest/utils';
import { useWalthamSelectStyles } from 'dashboard/WalthamForest/waltham-custom-date-range/waltham-custom-date-range.component';
import { WalthamCustomLegend } from 'dashboard/WalthamForest/waltham-custom-legend/waltham-custom-legend.component';
import {
  progressionVsPlanningTypes,
  progressionVsPlanningOptions,
  progressionVsPlanningPalette,
  ALL_TYPES,
} from 'dashboard/WalthamForest/waltham.constants';

const ProgressionVsPlanningSchedule = ({
  data,
  settings,
  setDashboardSettings,
}) => {
  const chartTheme = useChartTheme();

  const [configuration, setConfiguration] = useState(
    settings?.affordableHousingType ?? ALL_TYPES,
  );

  // The theme has a hard-coded value for stacked charts, but we want the
  // colours to be a different set. Therefore, I'm taking the theme and
  // overriding, the stacked colorScale setting here and passing it as as
  // a prop to the BaseChart.
  const updatedTheme = {
    ...chartTheme,
    stack: {
      colorScale: chartTheme.walthamChartColors.progressionVsPlanning,
    },
  };

  const apiLegendData = progressionVsPlanningTypes.map((range, i) => ({
    name: range,
    color: chartTheme.walthamChartColors.progressionVsPlanning[i],
  }));

  /**
   * @param {string} value
   */
  const handleTypeSelect = value => {
    setDashboardSettings(prev => ({
      ...prev,
      settings: { ...prev.settings, affordableHousingType: value },
    }));
    setConfiguration(value);
  };

  const ProgressPlanningHousingLegend = ({ width }) => {
    const { root, select } = useWalthamSelectStyles({});
    return (
      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        wrap="nowrap"
      >
        <Grid item>
          <WalthamCustomLegend apiLegendData={apiLegendData} width={width} />
        </Grid>
        <Grid item>
          <Select
            value={configuration}
            onChange={({ target: { value } }) => handleTypeSelect(value)}
            classes={{ root, select }}
            disableUnderline
          >
            <MenuItem value={ALL_TYPES}>{ALL_TYPES}</MenuItem>
            {Object.entries(progressionVsPlanningOptions).map(
              ([key, value]) => (
                <MenuItem key={key} value={key}>
                  {value}
                </MenuItem>
              ),
            )}
          </Select>
        </Grid>
      </Grid>
    );
  };

  const ProgressVsPlanningStackedChart = ({ width }) => {
    const barWidth = width / 20;

    const ranges =
      configuration === ALL_TYPES
        ? Object.values(progressionVsPlanningOptions)
        : [progressionVsPlanningOptions[configuration]];

    const x = 'Year';
    const totalsArray = labelsForArrayOfObjectsInclusive(
      data,
      ranges,
      ranges.length > 1 ? item => `Total: ${item}` : item => `${item}`,
    );

    return !!data ? (
      <VictoryStack>
        {ranges?.map(range => (
          <VictoryBar
            labelComponent={FlyoutTooltip()}
            key={range}
            data={filterByType(
              data,
              configuration,
              ALL_TYPES,
              progressionVsPlanningOptions,
              'Year',
            )}
            x={x}
            y={range}
            labels={totalsArray}
            style={{
              data: {
                width: barWidth,
                fill: progressionVsPlanningPalette[range],
              },
            }}
          />
        ))}
      </VictoryStack>
    ) : null;
  };

  return (
    <ChartWrapper
      title="Progression of Units Relating to Planning Schedule"
      info="This is a test description"
    >
      <StyledParentSize>
        {({ width }) => (
          <>
            <ProgressPlanningHousingLegend width={width} />
            <BaseChart
              width={width}
              yLabel="Number Of Units"
              xLabel="Financial Year"
              theme={updatedTheme}
            >
              {ProgressVsPlanningStackedChart({ width })}
            </BaseChart>
          </>
        )}
      </StyledParentSize>
    </ChartWrapper>
  );
};

export default ProgressionVsPlanningSchedule;
