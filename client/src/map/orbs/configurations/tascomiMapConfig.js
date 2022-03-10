import { FlyToInterpolator } from '@deck.gl/core';
import { subYears } from 'date-fns';
import { filter } from 'lodash';

import { MAX_ZOOM } from 'map/map.constants';
import { easeInOutCubic } from 'utils/easingFunctions';

import {
  filterValueSelector,
  setClickedFeatures,
  dataSelector,
} from '../layers.slice';

const PIN_COLOR = [255, 254, 25, 255];

const defaultDateRange = {
  startDate: subYears(new Date(2020, 2, 26), 1).toISOString(),
  endDate: new Date(2020, 2, 26).toISOString(),
};

export const DATE_TYPE = 'Commencement Date';

/**
 * @typedef {import('typings').GeoJsonFeature<{type?: string, Type?: string}>} ActionForHelpFeature
 */

const configuration = ({ id, dispatch, setViewState, orbState }) => {
  const filterRange = filterValueSelector(id)(orbState);
  const data = dataSelector(id)(orbState);

  const dateRangeFilter = filterRange?.dateRange ?? defaultDateRange;

  const filteredData = {
    ...data,
    features: filter(data?.features, feature => {
      if (!feature.properties[DATE_TYPE]) return false;

      if (feature.properties[DATE_TYPE] < dateRangeFilter.startDate)
        return false;

      if (feature.properties[DATE_TYPE] > dateRangeFilter.endDate) return false;

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
