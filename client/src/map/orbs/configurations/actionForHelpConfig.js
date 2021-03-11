import { FlyToInterpolator } from '@deck.gl/core';
import { MAX_ZOOM } from 'map/map.constants';
import iconMapping from './actionForHelpConfig.iconMapping.json';
import iconAtlas from './actionForHelpConfig.iconAtlas.svg';
import { easeInOutCubic } from 'utils/easingFunctions';
import { filterValueSelector, setClickedFeatures } from '../orbReducer';
import { filter } from 'lodash';

export const filterFeatures = (oldData, startDate, endDate) =>
  !oldData || (!startDate && !endDate)
    ? oldData
    : {
        ...oldData,
        features: filter(oldData.features, feature => {
          const submissionDateTimestamp = new Date(
            feature.properties['Submission Date'],
          ).getTime();
          return (
            (!startDate || submissionDateTimestamp >= startDate.getTime()) &&
            (!endDate || submissionDateTimestamp <= endDate.getTime())
          );
        }),
      };

/**
 * @typedef {import('typings/orbis').GeoJsonFeature<{type?: string, Type?: string}>} ActionForHelpFeature
 */

const configuration = ({
  id,
  data,
  activeSources,
  dispatch,
  setViewState,
  orbState,
}) => {
  const filterRange = filterValueSelector(id)(orbState);

  /** @param {import('typings/orbis').PickedMapFeature} info */
  const handleLayerClick = info => {
    if (info.object.properties.cluster) {
      if (info.object.properties.expansion_zoom <= MAX_ZOOM)
        setViewState({
          longitude: info.object.geometry.coordinates[0],
          latitude: info.object.geometry.coordinates[1],
          zoom: info.object.properties.expansion_zoom,
          transitionDuration: 1000,
          transitionEasing: easeInOutCubic,
          transitionInterpolator: new FlyToInterpolator(),
        });
      else
        dispatch(
          setClickedFeatures({ source_id: id, clickedFeatures: info.objects }),
        );
    } else
      dispatch(
        setClickedFeatures({ source_id: id, clickedFeatures: [info.object] }),
      );
  };

  /** @param {ActionForHelpFeature} feature */
  const getIcon = feature => feature.properties.type || feature.properties.Type;

  /** @param {ActionForHelpFeature} feature */
  const getIconSize = feature => (feature.properties.Type ? 15 : 60);

  return {
    id,
    iconMapping,
    iconAtlas,
    data: filterFeatures(
      data,
      filterRange?.startDate && new Date(filterRange.startDate),
      filterRange?.endDate && new Date(filterRange.endDate),
    ),
    visible: !!activeSources?.find(source => source.source_id === id),
    onClick: handleLayerClick,
    getIcon,
    getIconSize,
  };
};

export default configuration;
