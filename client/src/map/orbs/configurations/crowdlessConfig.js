import { resultsSelector } from '../slices/crowdless.slice';
import iconAtlas from './crowdlessConfig.iconAtlas.svg';
import iconMapping from './crowdlessConfig.iconMapping.json';

const configuration = ({ id, orbState }) => {
  const results = resultsSelector(orbState);
  return {
    id,
    data: results?.features,
    getPosition: d => d.geometry.coordinates,
    iconAtlas,
    iconMapping,
    getIcon: d => d.properties.crowdednessCategory,
    getSize: 60,
  };
};

export default configuration;
