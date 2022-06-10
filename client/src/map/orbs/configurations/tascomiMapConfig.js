import { FlyToInterpolator } from '@deck.gl/core';
import { isWithinInterval } from 'date-fns';
import { filter } from 'lodash';

import { MAX_ZOOM } from 'map/map.constants';
import { easeInOutCubic } from 'utils/easingFunctions';

import {
  filterValueSelector,
  setClickedFeatures,
  dataSelector,
} from '../layers.slice';

const PIN_COLOR = [72, 169, 197, 255];

/**
 * @typedef {import('typings').GeoJsonFeature<{type?: string, Type?: string}>} ActionForHelpFeature
 */

const configuration = ({ id, dispatch, setViewState, orbState, dateType }) => {
  const filterRange = filterValueSelector(id)(orbState);
  const data = dataSelector(id)(orbState);
  const dateRangeFilter = filterRange?.dateRange ?? {};

  const filteredData = {
    ...data,
    features: filter(data?.features, feature => {
      const filterDateType = filterRange?.dateType
        ? filterRange.dateType
        : dateType;

      if (!feature.properties[filterDateType]) return false;

      if (dateRangeFilter.startDate && feature.properties[filterDateType]) {
        const testDate = new Date(feature.properties[filterDateType]);
        const interval = {
          start: new Date(dateRangeFilter.startDate),
          end: new Date(dateRangeFilter.endDate),
        };

        if (!isWithinInterval(testDate, interval)) {
          return false;
        }
      } else {
        return false;
      }

      return true;
    }),
  };

  /** @param {import('typings').PickedMapFeature} info */
  const onClick = info => {
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

  const getPinColor = feature => PIN_COLOR;

  return {
    id,
    data: filteredData,
    visible: true,
    onClick: onClick,
    pointType: 'icon',
    getPinColor,
  };
};

export default configuration;
