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

const DEFAULT_COLOR = [246, 190, 0];
const PIN_COLORS = {
  allowed: [255, 254, 25, 255],
  approved: [55, 229, 216, 255],
  commenced: [245, 36, 85, 255],
  completed: [138, 234, 115, 255],
  superseded: [255, 160, 72, 255],
  lapsed: [5, 195, 255, 255],
};

const defaultDateRange = {
  startDate: subYears(new Date(2020, 2, 26), 1).toISOString(),
  endDate: new Date(2020, 2, 26).toISOString(),
};

const configuration = ({
  id,
  orbState,
  dispatch,
  setViewState,
  onPointClick,
  onGroupClick,
}) => {
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
      const dateType = filterRange?.dateType
        ? filterRange.dateType
        : 'decision_date';
      if (
        dateRangeFilter.startDate &&
        feature.properties[dateType] < dateRangeFilter.startDate
      )
        return false;

      if (
        dateRangeFilter.endDate &&
        feature.properties[dateType] > dateRangeFilter.endDate
      )
        return false;

      if (
        constructionPhaseFilter?.includes(
          feature.properties?.['Status Category'],
        )
      )
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

  const defaultClick = data =>
    dispatch(
      setClickedFeatures({
        key: id,
        clickedFeatures: data,
      }),
    );

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
      } else {
        if (onGroupClick) {
          return defaultClick(info.objects);
        }
      }
    } else {
      if (onPointClick) {
        return defaultClick([info.object]);
      }
    }
  };

  const getPinColor = feature => {
    let color = DEFAULT_COLOR;
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
