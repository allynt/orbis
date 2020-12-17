import { PieChart } from 'components/charts/pie/pie.component';
import { LayersListItem } from 'data-layers/layers-list/layers-list-item/layers-list-item.component';
import React, { useMemo } from 'react';

/**
 * @param {{
 *   selectedProperty: import('typings/orbis').Property
 *   pickedFeature?: any
 * }} props
 */
export const PropertyBreakdownChart = ({ selectedProperty, pickedFeature }) => {
  const data = useMemo(
    () =>
      selectedProperty?.breakdown?.map(breakdownProperty => ({
        value: Number(pickedFeature?.properties[breakdownProperty]),
        name: breakdownProperty,
      })),
    [selectedProperty, pickedFeature],
  );
  return (
    <LayersListItem
      title={
        <span style={{ fontSize: '1rem', fontWeight: 600 }}>Breakdown</span>
      }
      defaultExpanded
    >
      <div style={{ display: 'grid', placeItems: 'center' }}>
        <PieChart data={data || []} />
      </div>
    </LayersListItem>
  );
};
