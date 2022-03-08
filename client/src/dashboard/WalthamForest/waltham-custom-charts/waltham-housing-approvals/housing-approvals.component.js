import React, { useMemo, useState } from 'react';

import {
  ToggleButtonGroup,
  ToggleButton,
  makeStyles,
} from '@astrosat/astrosat-ui';

import {
  VictoryGroup,
  VictoryLine,
  VictoryScatter,
  VictoryChart,
  VictoryVoronoiContainer,
  VictoryTooltip,
} from 'victory';

import { BaseChart } from 'dashboard/charts/base-chart/base-chart.component';
import { ChartWrapper } from 'dashboard/charts/chart-wrapper.component';
import * as MOCK_DATA from 'dashboard/mock-data/waltham-forest/mock_approvals_granted';
import { useChartTheme } from 'dashboard/useChartTheme';
import FlyoutTooltip from 'dashboard/WalthamForest/FlyoutTooltip';
import { WalthamCustomLegend } from 'dashboard/WalthamForest/waltham-custom-legend/waltham-custom-legend.component';
import { HOUSING_APPROVAL_DATA_TYPES } from 'dashboard/WalthamForest/waltham.constants';

import configuration from '../../../../map/orbs/configurations/pldConfig';
import { labelsForArrayOfObjectsInclusive } from '../../tooltips-utils';
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
  console.log('Configaration', configuration);
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

  // const dataByType = lineDataTransformer;

  const dataByType = useMemo(
    () =>
      lineDataTransformer(
        data?.find(p => {
          console.log('data in memo', data);
          console.log('p name', p.name);
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

          <VictoryLine
            {...props}
            style={{ data: { stroke: color } }}
            key={range}
          />;
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
              size={10}
              style={{ data: { stroke: color } }}
              labelComponent={<VictoryTooltip />}
              labels={({ datum }) => {
                console.log('Props', props);
                console.log('DAtum_Y', datum._y);
                return ` ${datum._y}`;
              }}
            />
          );
        })}
        ;
      </VictoryGroup>
    );
  };

  // const renderLineChart = width =>
  //   !!dataByType
  //     ? ranges?.map((range, i) => {
  //         const color = walthamChartColors.housingApproval[i],
  //           props = {
  //             data: dataByType,
  //             x,
  //             y: range,
  //           };
  //         return (
  //           <VictoryGroup key={range}>
  //             <VictoryLine {...props} style={{ data: { stroke: color } }} />

  //             <VictoryScatter
  //               {...props}
  //               style={{ data: { stroke: color } }}
  //               labelComponent={FlyoutTooltip()}
  //               labels={({ datum }) => `Total: ${datum._y}`}
  //             />
  //           </VictoryGroup>
  //         );
  //       })
  //     : null;

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

//   if (!dataByType) return null;

//   return (
// <VictoryChart key="myLineChart">
//   {ranges?.map((range, i) => {
//     const color = walthamChartColors.housingApproval[i],
//       props = {
//         data: dataByType,
//         x,
//         y: range,
//       };
//     <VictoryLine {...props} style={{ data: { stroke: color } }} />;
//   })}
//   ;
//   {ranges?.map((range, i) => {
//     const color = walthamChartColors.housingApproval[i],
//       props = {
//         data: dataByType,
//         x,
//         y: range,
//       };
//     <VictoryScatter
//       {...props}
//       size={10}
//       style={{ data: { stroke: color } }}
//       labelComponent={<VictoryTooltip />}
//       labels={({ datum }) => {
//         console.log('Props', props);
//         console.log('DAtum_Y', datum._y);
//         return ` ${datum._y}`;
//       }}
//     />;
//   })}
//   ;
// </VictoryChart>
//   );
// };
