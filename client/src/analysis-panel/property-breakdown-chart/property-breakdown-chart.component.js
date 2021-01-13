import { PieChart, SidePanelSection } from 'components';
import * as React from 'react';

/**
 * @param {{
 *   selectedProperty: import('typings/orbis').Property
 *   pickedFeature?: any
 * }} props
 */
export const PropertyBreakdownChart = ({ data }) => {
  return (
    <SidePanelSection
      title={
        <span style={{ fontSize: '1rem', fontWeight: 600 }}>Breakdown</span>
      }
      defaultExpanded
    >
      <PieChart data={data || []} />
    </SidePanelSection>
  );
};
