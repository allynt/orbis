import { resultsSelector } from '../slices/crowdless.slice';
import iconAtlas from './crowdlessConfig.iconAtlas.svg';
import iconMapping from './crowdlessConfig.iconMapping.json';

const configuration = ({ id, orbState }) => {
  const results = resultsSelector(orbState);
  return {
    id,
    data: results?.features,
    /** @param {CrowdlessFeature} feature */
    getPosition: feature => feature.geometry.coordinates,
    iconAtlas,
    iconMapping,
    /** @param {CrowdlessFeature} feature */
    getIcon: feature => feature.properties.crowdednessCategory,
    getSize: 60,
  };
};

export default configuration;
