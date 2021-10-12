import { get } from 'lodash';

import { filterValueSelector, dataSelector } from '../layers.slice';
import pinIconConfig from './pinIconConfig';

/**
 * @param {{
 *   id: import('typings').Source['source_id']
 *   data: {features: import('typings').GeoJsonFeature[]}
 *   orbState: import('../orbReducer').OrbState
 *   filterType?: 'blacklist' | 'whitelist'
 *   filterProperty: string
 * }} props
 */
const filterablePinIconConfig = ({
  id,
  orbState,
  filterType = 'blacklist',
  filterProperty,
  ...rest
}) => {
  const filterValue = filterValueSelector(id)(orbState);
  const data = dataSelector(id)(orbState);

  const getFeatures = () => {
    if (!filterValue || !data) return data;
    let newFeatures;
    if (filterType === 'blacklist')
      newFeatures = data.features.filter(f => {
        const filterPropertyValue = get(f.properties, filterProperty);
        return !filterValue.some(v => filterPropertyValue.includes(v));
      });
    if (filterType === 'whitelist')
      newFeatures = data.features.filter(f => {
        const filterPropertyValue = get(f.properties, filterProperty);
        return filterValue.some(v => filterPropertyValue.includes(v));
      });
    return {
      ...data,
      features: newFeatures,
    };
  };

  return pinIconConfig({
    id,
    filterData: getFeatures(),
    orbState,
    ...rest,
  });
};

export default filterablePinIconConfig;
