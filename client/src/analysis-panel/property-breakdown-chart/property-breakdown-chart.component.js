import * as React from 'react';

import { Grid } from '@astrosat/astrosat-ui';

import { VictoryPie } from 'victory';

import { aggregateValues } from 'analysis-panel/aggregateValues';
import { LegendItem, SidePanelSection } from 'components';
import { useChartTheme } from 'components/charts/useChartTheme';
import { DEFAULT_DECIMAL_PRECISION } from 'map/map.constants';
import { isRealValue } from 'utils/isRealValue';

/**
 *
 * @typedef {{
 *   info?: string
 * }} PropertyBreakdownChartProps
 */

/** @type {import('typings/orbis').AnalysisPanelComponent<PropertyBreakdownChartProps} */
export const PropertyBreakdownChart = ({
  clickedFeatures,
  selectedProperty,
  info,
}) => {
  const { colors, ...chartTheme } = useChartTheme();
  const data = clickedFeatures
    ? selectedProperty?.breakdown?.map(name => {
        const value = aggregateValues(clickedFeatures, {
          name,
          aggregation: selectedProperty.aggregation,
          precision: selectedProperty.precision,
        });

        return {
          value,
          name,
        };
      })
    : [];
  if (data?.some(v => !isRealValue(v.value))) return null;
  return (
    <SidePanelSection title="Breakdown" defaultExpanded info={info}>
      <Grid container spacing={2}>
        <Grid item xs={12} component="svg" viewBox="0 0 400 400">
          <VictoryPie
            animate
            standalone={false}
            theme={chartTheme}
            data={data}
            radius={180}
            innerRadius={90}
            padAngle={2}
            x="value"
            y="value"
            labels={({ datum }) =>
              datum.value.toFixed(
                selectedProperty.precision ?? DEFAULT_DECIMAL_PRECISION,
              )
            }
            labelRadius={130}
          />
        </Grid>
        <Grid item xs={12} container spacing={1}>
          {data.map(({ name }, i) => (
            <LegendItem
              key={name}
              text={name}
              color={colors[i % colors.length]}
            />
          ))}
        </Grid>
      </Grid>
    </SidePanelSection>
  );
};
