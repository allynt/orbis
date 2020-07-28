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

export const sidebarComponents = {
  [LAYER_IDS.astrosat.rice.paddiesHealth.latest]: DateSlider,
};

export const useRiceOrb = (data, activeLayers) => {
  const dispatch = useDispatch();
  const maxDateRange = useSelector(maxDateRangeSelector);
  const dateRange = useSelector(dateRangeSelector);

  useEffect(() => {
    if (data[LAYER_IDS.astrosat.rice.paddiesHealth.latest]) {
      const newMaxDateRange = data[
        LAYER_IDS.astrosat.rice.paddiesHealth.latest
      ].features[0].properties.ndvi.reduce((prev, curr) => {
        const date = new Date(curr.timestamp);
        return {
          min: date < prev.min ? date : prev.min,
          max: date > prev.max ? date : prev.max,
        };
      }, maxDateRange);
      if (
        newMaxDateRange.min !== maxDateRange.min ||
        newMaxDateRange.max !== maxDateRange.max
      )
        dispatch(setMaxDateRange(newMaxDateRange));
    }
  }, [data, maxDateRange, dispatch]);

  const layers = [
    paddiesHealthLayer({
      id: LAYER_IDS.astrosat.rice.paddiesHealth.latest,
      data: data[LAYER_IDS.astrosat.rice.paddiesHealth.latest],
      visible: activeLayers?.includes(
        LAYER_IDS.astrosat.rice.paddiesHealth.latest,
      ),
      dateRange,
    }),
  ];

  return { layers, mapComponents: [], sidebarComponents };
};
useRiceOrb.id = 'rice';
