import {
  resultsSelector,
  selectedResultSelector,
  setSelectedResult,
} from '../slices/crowdless.slice';
import iconAtlas from './crowdlessConfig.iconAtlas.svg';
import iconMapping from './crowdlessConfig.iconMapping.json';

const configuration = ({ id, orbState, dispatch }) => {
  const results = resultsSelector(orbState);
  const selectedResult = selectedResultSelector(orbState);
  return {
    id,
    data: results?.features,
    /** @param {CrowdlessFeature} feature */
    getPosition: feature => feature.geometry.coordinates,
    iconAtlas,
    iconMapping,
    /** @param {CrowdlessFeature} feature */
    getIcon: feature =>
      `${feature.properties.crowdednessCategory}${
        feature.properties.placeID === selectedResult?.properties?.placeID
          ? '-selected'
          : ''
      }`,
    getSize: feature =>
      feature.properties.placeID === selectedResult?.properties?.placeID
        ? 60 * 1.4
        : 60,
    pickable: true,
    onClick: pickedInfo => dispatch(setSelectedResult(pickedInfo.object)),
    updateTriggers: {
      getIcon: [selectedResult],
      getSize: [selectedResult],
    },
  };
};

export default configuration;
