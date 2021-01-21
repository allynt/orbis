import pinIconConfig from './pinIconConfig';

import { categoryFiltersSelectorFactory } from '../slices/mysupplylynk.slice';

const categoryFilterPinIconConfig = ({ id, data, orbState, ...rest }) => {
  const categoryFilters = categoryFiltersSelectorFactory(id)(orbState);

  const getFeatures = () => {
    const obj = data;

    const hasCategory = feat => {
      return feat.properties.Items
        ? feat.properties.Items.some(item =>
            categoryFilters?.includes(item.Category),
          )
        : categoryFilters?.includes(feat?.properties?.Category);
    };

    let filteredFeatures;
    if (obj) {
      filteredFeatures = obj.features.filter(feat => hasCategory(feat));
    }

    if (filteredFeatures) {
      return {
        type: 'FeatureCollection',
        features: filteredFeatures,
      };
    }
  };

  return pinIconConfig({ id, data: getFeatures(), orbState, ...rest });
};

export default categoryFilterPinIconConfig;
