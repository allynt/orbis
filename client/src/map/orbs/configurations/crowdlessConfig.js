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

  /** @param {CrowdlessFeature} feature */
  const getPosition = feature => feature.geometry.coordinates;

  /** @param {CrowdlessFeature} feature */
  const getIcon = feature =>
    `${feature.properties.crowdednessCategory}${
      feature.properties.placeId === selectedResult?.properties?.placeId
        ? '-selected'
        : ''
    }`;

  /** @param {CrowdlessFeature} feature */
  const getSize = feature =>
    feature.properties.placeId === selectedResult?.properties?.placeId
      ? 60 * 1.4
      : 60;

  /** @param {{object: CrowdlessFeature}} pickedInfo */
  const onClick = pickedInfo => dispatch(setSelectedResult(pickedInfo.object));

  return {
    id,
    visible,
    data: results?.features,
    getPosition,
    iconAtlas,
    iconMapping,
    getIcon,
    getSize,
    pickable: true,
    onClick,
    updateTriggers: {
      getIcon: [selectedResult],
      getSize: [selectedResult],
    },
  };
};

export default configuration;
