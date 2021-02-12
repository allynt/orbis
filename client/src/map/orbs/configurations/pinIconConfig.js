import { FlyToInterpolator } from '@deck.gl/core';
import { MAX_ZOOM } from 'map/map.constants';
import { easeInOutCubic } from 'utils/easingFunctions';

import {
  setClickedFeatures,
  setHoveredFeatures,
  layersVisibilitySelector,
} from '../orbReducer';

/**
 * @typedef {import('typings/orbis').PickedMapFeature} PickedMapFeature
 */

/**
 * @typedef {import('typings/orbis').GeoJsonFeature} GeoJsonFeature
 */

const configuration = ({
  id,
  data,
  activeSources,
  dispatch,
  setViewState,
  orbState,
  onPointClick,
  onGroupClick,
  onPointHover,
  onGroupHover,
}) => {
  const isVisible = layersVisibilitySelector(id)(orbState);
  /**
   * @param {GeoJsonFeature[]} data
   */
  const defaultClick = data =>
    dispatch(
      setClickedFeatures({
        source_id: id,
        clickedFeatures: data,
      }),
    );

  /**
   * @param {GeoJsonFeature[]} data
   */
  const defaultHover = data =>
    dispatch(
      setHoveredFeatures({
        source_id: id,
        hoveredFeatures: data,
      }),
    );

  /**
   * @param {PickedMapFeature} info
   */
  const handleHover = info => {
    if (info?.object?.properties?.cluster) {
      if (info.object.properties.expansion_zoom >= MAX_ZOOM) {
        const data = info.objects ? info.objects : [];
        if (typeof onGroupHover === 'function') return onGroupHover(data);
        if (onGroupHover === true) return defaultHover(data);
      }
    } else {
      const data = info.object ? [info.object] : [];
      if (typeof onPointHover === 'function') return onPointHover(data);
      if (onPointHover === true) return defaultHover(data);
    }
  };

  /**
   * @param {PickedMapFeature} info
   */
  const handleClick = info => {
    if (info?.object?.properties?.cluster) {
      if (info.object.properties.expansion_zoom <= MAX_ZOOM)
        setViewState({
          longitude: info.object.geometry.coordinates[0],
          latitude: info.object.geometry.coordinates[1],
          zoom: info.object.properties.expansion_zoom,
          transitionDuration: 1000,
          transitionEasing: easeInOutCubic,
          transitionInterpolator: new FlyToInterpolator(),
        });
      else {
        if (typeof onGroupClick === 'function')
          return onGroupClick(info.objects);
        if (onGroupClick === true) return defaultClick(info.objects);
      }
    } else {
      if (typeof onPointClick === 'function')
        return onPointClick([info.object]);
      if (onPointClick === true) return defaultClick([info.object]);
    }
  };

  return {
    id,
    data: data,
    visible:
      isVisible && !!activeSources?.find(source => source.source_id === id),
    onClick: handleClick,
    onHover: handleHover,
  };
};

export default configuration;
