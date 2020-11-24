import { resultsSelector, visibilitySelector } from '../slices/crowdless.slice';
import iconAtlas from './crowdlessConfig.iconAtlas.svg';
import iconMapping from './crowdlessConfig.iconMapping.json';

const configuration = ({ id, orbState }) => {
  const results = resultsSelector(orbState);
  const visible = visibilitySelector(orbState);
  return {
    id,
    data: results?.features,
    visible,
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
