import { PieChart } from 'components/charts/pie/pie.component';
import { LayersListItem } from 'data-layers/layers-list/layers-list-item/layers-list-item.component';
import * as React from 'react';

/**
 * @param {{
 *   selectedProperty: import('typings/orbis').Property
 *   pickedFeature?: any
 * }} props
 */
export const PropertyBreakdownChart = ({ data }) => {
  return (
    <LayersListItem
      title={
        <span style={{ fontSize: '1rem', fontWeight: 600 }}>Breakdown</span>
      }
      defaultExpanded
    >
      <PieChart data={data || []} />
    </LayersListItem>
  );
};
