import React from 'react';
import { action } from '@storybook/addon-actions';
import { CheckboxFilters } from './checkbox-filters.component';

import { CATEGORIES } from '../../mySupplyLynk/mysupplylynk.constants';

export default { title: 'Orbs/MySupplyLynk/Checkbox Filters' };

export const Default = () => (
  <CheckboxFilters
    categories={CATEGORIES}
    selectedFeatures={[]}
    setSelectedFeatures={action('Set Selected Features')}
  />
);
