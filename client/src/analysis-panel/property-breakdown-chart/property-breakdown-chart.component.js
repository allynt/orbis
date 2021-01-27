import * as React from 'react';

import { PieChart, SidePanelSection } from 'components';
import { aggregateValues } from 'analysis-panel/aggregateValues';
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
      <PieChart data={data} precision={selectedProperty?.precision} />
    </SidePanelSection>
  );
};
