import { FlyToInterpolator } from '@deck.gl/core';
import { MAX_ZOOM } from 'map/map.constants';
import iconMapping from './actionForHelpConfig.iconMapping.json';
import iconAtlas from './actionForHelpConfig.iconAtlas.svg';
import { easeInOutCubic } from 'utils/easingFunctions';
import { filterValueSelector, setClickedFeatures } from '../layers.slice';
import { filter } from 'lodash';

export const filterFeatures = (oldData, startDate, endDate, status = 'ALL') => {
  const filteredByStatus =
    status === 'ALL'
      ? undefined
      : {
          ...oldData,
          features: oldData?.features?.filter(
            f => f?.properties?.status === status,
          ),
        };

  const data = filteredByStatus || oldData;
  if (!data || (!startDate && !endDate)) return data;
  return {
    ...data,
    features: filter(data?.features, feature => {
      const submissionDateTimestamp = new Date(
        feature.properties['Submission Date'],
      ).getTime();
      return (
        (!startDate || submissionDateTimestamp >= startDate.getTime()) &&
        (!endDate || submissionDateTimestamp <= endDate.getTime())
      );
    }),
  };
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
          setClickedFeatures({ key: id, clickedFeatures: info.objects }),
        );
    } else
      dispatch(setClickedFeatures({ key: id, clickedFeatures: [info.object] }));
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
      filterRange?.range?.startDate && new Date(filterRange?.range.startDate),
      filterRange?.range?.endDate && new Date(filterRange?.range.endDate),
      filterRange?.status,
    ),
    visible: !!activeSources?.find(source => source.source_id === id),
    onClick: handleLayerClick,
    getIcon,
    getIconSize,
  };
};

export default configuration;
