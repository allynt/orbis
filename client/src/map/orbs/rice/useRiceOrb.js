import { LAYER_IDS } from 'map/map.constants';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { paddiesHealthLayer } from './paddies-health';
import { DateSlider } from './paddies-health/date-slider.component';
import {
  dateRangeSelector,
  maxDateRangeSelector,
  setMaxDateRange,
} from './rice.slice';

const LAYER_ID = 'astrosat/rice/paddies-health/latest';

export const sidebarComponents = {
  [LAYER_ID]: DateSlider,
};

export const useRiceOrb = (data, activeSources) => {
  const dispatch = useDispatch();
  const maxDateRange = useSelector(maxDateRangeSelector);
  const dateRange = useSelector(dateRangeSelector);

  useEffect(() => {
    if (data[LAYER_ID]) {
      const newMaxDateRange = data[LAYER_ID].features[0].properties.ndvi.reduce(
        (prev, curr) => {
          const date = new Date(curr.timestamp);
          return {
            min: date < prev.min ? date : prev.min,
            max: date > prev.max ? date : prev.max,
          };
        },
        maxDateRange,
      );
      if (
        newMaxDateRange.min !== maxDateRange.min ||
        newMaxDateRange.max !== maxDateRange.max
      )
        dispatch(setMaxDateRange(newMaxDateRange));
    }
  }, [data, maxDateRange, dispatch]);

  const layers = [
    paddiesHealthLayer({
      id: LAYER_ID,
      data: data[LAYER_ID],
      visible: !!activeSources?.find(source => source.source_id === LAYER_ID),
      dateRange,
    }),
  ];

  return {
    layers,
    mapComponents: [],
    sidebarComponents,
  };
};
useRiceOrb.id = 'rice';
