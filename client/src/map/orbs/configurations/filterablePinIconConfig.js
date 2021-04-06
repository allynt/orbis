import { get } from 'lodash';
import { filterValueSelector } from '../layers.slice';
import pinIconConfig from './pinIconConfig';

/**
 * @param {{
 *   id: import('typings/orbis').Source['source_id']
 *   data: {features: import('typings/orbis').GeoJsonFeature[]}
 *   orbState: import('../orbReducer').OrbState
 *   filterType?: 'blacklist' | 'whitelist'
 *   filterProperty: string
 * }} props
 */
const filterablePinIconConfig = ({
  id,
  data,
  orbState,
  filterType = 'blacklist',
  filterProperty,
  ...rest
}) => {
  const filterValue = filterValueSelector(id)(orbState);

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
    data: getFeatures(),
    orbState,
    ...rest,
  });
};

export default filterablePinIconConfig;
