import { FlyToInterpolator } from '@deck.gl/core';
import { subYears } from 'date-fns';
import { filter } from 'lodash';

import { MAX_ZOOM } from 'map/map.constants';
import { easeInOutCubic } from 'utils/easingFunctions';

import {
  setClickedFeatures,
  filterValueSelector,
  dataSelector,
} from '../layers.slice';

const PIN_COLORS = {
  allowed: [170, 0, 0, 255],
  approved: [55, 229, 216, 255],
  commenced: [245, 36, 85, 255],
  completed: [138, 234, 115, 255],
  lapsed: [0, 0, 0, 255],
  'pending legacy record': [85, 0, 255, 255],
  superseded: [0, 85, 255, 255],
};

const defaultDateRange = {
  startDate: subYears(new Date(2020, 2, 26), 1).toISOString(),
  endDate: new Date(2020, 2, 26).toISOString(),
};

const configuration = ({ id, orbState, dispatch, setViewState }) => {
  const filterRange = filterValueSelector(id)(orbState);
  const rawData = dataSelector(id)(orbState);

  const {
    constructionPhase: constructionPhaseFilter,
    developmentType: developmentTypeFilter,
  } = filterRange ?? {};
  const dateRangeFilter = filterRange?.dateRange ?? defaultDateRange;
  const filteredData = {
    ...rawData,
    features: filter(rawData?.features, feature => {
      if (
        dateRangeFilter.startDate &&
        feature.properties.decision_date < dateRangeFilter.startDate
      )
        return false;

      if (
        dateRangeFilter.endDate &&
        feature.properties.decision_date > dateRangeFilter.endDate
      )
        return false;

      if (constructionPhaseFilter?.includes(feature.properties?.Status))
        return false;

      if (
        developmentTypeFilter?.includes(
          feature.properties?.['Development Type'],
        )
      )
        return false;

      return true;
    }),
  };

  const onClick = info => {
    if (info.object.properties.cluster) {
      if (info.object.properties.expansion_zoom <= MAX_ZOOM) {
        setViewState({
          longitude: info.object.geometry.coordinates[0],
          latitude: info.object.geometry.coordinates[1],
          zoom: info.object.properties.expansion_zoom,
          transitionDuration: 1000,
          transitionEasing: easeInOutCubic,
          transitionInterpolator: new FlyToInterpolator(),
        });
      }
    } else {
      return dispatch(
        setClickedFeatures({ key: id, clickedFeatures: [info.object] }),
      );
    }
  };

  const getPinColor = feature => {
    let color = null;
    if (!feature.properties['cluster']) {
      color = PIN_COLORS[feature.properties['Status'].toLowerCase()];
    }

    return color;
  };

  return {
    data: filteredData,
    pointType: 'icon',
    getPinColor,
    pickable: true,
    onClick,
  };
};

export default configuration;
