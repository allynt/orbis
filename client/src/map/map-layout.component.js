import React, { useEffect, useState } from 'react';

import Measure from 'react-measure';
import { useDispatch, useSelector } from 'react-redux';

import SideMenu from '../side-menu/side-menu.component';
import Toolbar from '../toolbar/toolbar.component';
import { getToolbarItems } from '../toolbar/toolbar-config';

import { userSelector } from 'accounts/accounts.selectors';
import {
  fetchSources,
  selectPollingPeriod,
} from 'data-layers/data-layers.slice';

import { selectedPinnedScenesSelector } from 'satellites/satellites.slice';

import Map from './map.component';
import styles from './map-layout.module.css';
import { isCompareModeSelector } from './map.slice';

const times = (n, fn) => {
  const result = [];
  for (let i = 0; i < n; i++) {
    result.push(fn(i));
  }
  return result;
};

const MapLayout = () => {
  const dispatch = useDispatch();
  const user = useSelector(userSelector);
  const pollingPeriod = useSelector(selectPollingPeriod);
  const isCompareMode = useSelector(isCompareModeSelector);
  const selectedPinnedScenes = useSelector(selectedPinnedScenesSelector);
  const toolbarItems = getToolbarItems(dispatch, user);

  const mapCount = isCompareMode ? 2 : 1;
  const userExists = user ? true : false;

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
    if (userExists) {
      dispatch(fetchSources());
      const interval = setInterval(() => {
        dispatch(fetchSources());
      }, pollingPeriod);
      return () => {
        clearInterval(interval);
      };
    }
  }, [userExists, pollingPeriod, dispatch]);

  return (
    <Measure bounds onResize={contentRect => setBounds(contentRect.bounds)}>
      {({ measureRef }) => (
        <div
          ref={measureRef}
          className={`${styles.layout} ${
            isCompareMode ? styles.compareMode : styles[`layout-${mapCount}`]
          }`}
        >
          {user && (
            <>
              <Toolbar user={user} items={toolbarItems} />
              <SideMenu />
            </>
          )}
          {times(mapCount, i => (
            <div
              key={i}
              style={
                i === 0
                  ? {
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      top: 0,
                      left: 0,
                    }
                  : {
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      top: 0,
                      left: 0,
                      clip: `rect(0px, 999em, 100vh, ${
                        compareRatio * bounds.width
                      }px)`,
                    }
              }
            >
              <Map
                compareRatio={compareRatio}
                compare={isCompareMode}
                selectedPinnedScenes={selectedPinnedScenes}
                comparisonScene={selectedPinnedScenes[i]}
              />
            </div>
          ))}
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
