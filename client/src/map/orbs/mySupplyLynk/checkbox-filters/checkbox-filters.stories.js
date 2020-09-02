import React from 'react';
import { CheckboxFilters } from './checkbox-filters.component';

import { CATEGORIES } from '../mysupplylynk.constants';

export default { title: 'Orbs/MySupplyLynk/Checkbox Filters' };

export const Default = () => (
  <CheckboxFilters
    categories={CATEGORIES}
    selectedFeatures={[]}
    setSelectedFeatures={features => console.log('Features: ', features)}
  />
);
