import React, { useEffect, useState } from 'react';

import Measure from 'react-measure';
import { useDispatch, useSelector } from 'react-redux';

import ControlPanel from '../control-panel/control-panel.component';
import {
  fetchSources,
  selectPollingPeriod,
} from 'data-layers/data-layers.slice';

import { selectedPinnedScenesSelector } from 'satellites/satellites.slice';

import Map from './map.component';
import styles from './map-layout.module.css';
import { isCompareModeSelector } from './map.slice';
import { AnalysisPanel } from 'analysis-panel/analysis-panel.component';

const times = (n, fn) => {
  const result = [];
  for (let i = 0; i < n; i++) {
    result.push(fn(i));
  }
  return result;
};

const MapLayout = () => {
  const dispatch = useDispatch();
  const pollingPeriod = useSelector(selectPollingPeriod);
  const isCompareMode = useSelector(isCompareModeSelector);
  const selectedPinnedScenes = useSelector(selectedPinnedScenesSelector);

  const mapCount = isCompareMode ? 2 : 1;

  const [compareRatio, setCompareRatio] = useState(0.5);
  const [bounds, setBounds] = useState({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: 0,
    height: 0,
  });

  const compareMove = event => {
    event = event.touches ? event.touches[0] : event;
    let x = event.clientX - bounds.left;
    if (x < 0) x = 0;
    if (x > bounds.width) x = bounds.width;
    const ratio = x / bounds.width;
    setCompareRatio(ratio);
  };

  const compareTouchEnd = () => {
    document.removeEventListener('touchmove', compareMove);
    document.removeEventListener('touchend', compareTouchEnd);
  };

  const compareMouseEnd = () => {
    document.removeEventListener('mousemove', compareMove);
    document.removeEventListener('mouseup', compareMouseEnd);
  };

  const compareDown = event => {
    event && event.preventDefault();
    if (event.touches) {
      document.addEventListener('touchmove', compareMove);
      document.addEventListener('touchend', compareTouchEnd);
    } else {
      document.addEventListener('mousemove', compareMove);
      document.addEventListener('mouseup', compareMouseEnd);
    }
  };

  useEffect(() => {
    // Poll API to get new Data token (expires every X seconds/mins etc)
    // this also fetches the list of data sources the user has access to.
    dispatch(fetchSources());
    const interval = setInterval(() => {
      dispatch(fetchSources());
    }, pollingPeriod);
    return () => {
      clearInterval(interval);
    };
  }, [pollingPeriod, dispatch]);

  return (
    <Measure bounds onResize={contentRect => setBounds(contentRect.bounds)}>
      {({ measureRef }) => (
        <div
          ref={measureRef}
          className={`${styles.layout} ${
            isCompareMode ? styles.compareMode : styles[`layout-${mapCount}`]
          }`}
        >
          <ControlPanel />
          <Map
            compareRatio={compareRatio}
            compare={isCompareMode}
            selectedPinnedScenes={selectedPinnedScenes}
          />
          <AnalysisPanel />
          {isCompareMode && (
            <div
              className={styles.compare}
              style={{
                transform: `translate(${compareRatio * bounds.width}px, 0px`,
              }}
              onMouseDown={compareDown}
              onTouchStart={compareDown}
            >
              <div className={styles.swiper} />
            </div>
          )}
        </div>
      )}
    </Measure>
  );
};

export default MapLayout;
