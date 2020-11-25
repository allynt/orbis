import {
  resultsSelector,
  selectedResultSelector,
  setSelectedResult,
  visibilitySelector,
} from '../slices/crowdless.slice';
import iconAtlas from './crowdlessConfig.iconAtlas.svg';
import iconMapping from './crowdlessConfig.iconMapping.json';

const configuration = ({ id, orbState, dispatch }) => {
  const results = resultsSelector(orbState);
  const visible = visibilitySelector(orbState);
  const selectedResult = selectedResultSelector(orbState);
  return {
    id,
    visible,
    data: results?.features,
    /** @param {CrowdlessFeature} feature */
    getPosition: feature => feature.geometry.coordinates,
    iconAtlas,
    iconMapping,
    /** @param {CrowdlessFeature} feature */
    getIcon: feature =>
      `${feature.properties.crowdednessCategory}${
        feature.properties.placeId === selectedResult?.properties?.placeId
          ? '-selected'
          : ''
      }`,
    /** @param {CrowdlessFeature} feature */
    getSize: feature =>
      feature.properties.placeId === selectedResult?.properties?.placeId
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
