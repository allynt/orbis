import * as React from 'react';

import { PieChart, SidePanelSection } from 'components';

/**
 * @param {{
 *   data: {
 *    value: number;
 *    name: string;
 *   }[]
 * }} props
 */
export const PropertyBreakdownChart = ({ data }) => {
  return (
    <SidePanelSection title="Breakdown" defaultExpanded>
      <PieChart data={data || []} />
    </SidePanelSection>
  );
};
