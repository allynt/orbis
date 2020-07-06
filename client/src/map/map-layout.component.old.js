import React, { useEffect, useState } from 'react';

import Measure from 'react-measure';

import Map from './map.component';
import syncMaps from './mapbox-gl-sync-move';
import { useDispatch, useSelector } from 'react-redux';

import { getToolbarItems } from '../toolbar/toolbar-config';

import Toolbar from '../toolbar/toolbar.component';

import styles from './map-layout.module.css';

const times = (n, fn) => {
  const result = [];
  for (let i = 0; i < n; i++) {
    result.push(fn(i));
  }
  return result;
};

const MapLayout = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.accounts.user);
  const isCompareMode = useSelector(state => state.map.isCompareMode);
  const mapCount = isCompareMode ? 2 : 1;

  const toolbarItems = getToolbarItems(dispatch, user);

  const mapStyle = useSelector(state => state.map.selectedMapStyle);
  const selectedPinnedScenes = useSelector(state => state.satellites.selectedPinnedScenes);

  const [compareRatio, setCompareRatio] = useState(0.5);
  const [bounds, setBounds] = useState({ top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0 });

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

  const [map1, setMap1] = useState(null);
  const [map2, setMap2] = useState(null);

  useEffect(() => {
    if (map1 && map2) {
      const removeSyncMove = syncMaps([map1, map2]);
      return () => {
        removeSyncMove();
      };
    }
  }, [map1, map2]);

  return (
    <div className={styles['map-column']}>
      <Measure bounds onResize={contentRect => setBounds(contentRect.bounds)}>
        {({ measureRef }) => (
          <div
            ref={measureRef}
            className={`${styles.layout} ${isCompareMode ? styles.compareMode : styles[`layout-${mapCount}`]}`}
            data-testid="map-container"
          >
            {times(mapCount, i => (
              <div
                key={i}
                style={
                  i === 0
                    ? { position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }
                    : {
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        top: 0,
                        left: 0,
                        clip: `rect(0px, 999em, 100vh, ${compareRatio * bounds.width}px)`,
                      }
                }
              >
                <Map
                  setMap={i === 0 ? setMap1 : setMap2}
                  attribution={bottomRight(i, mapCount)}
                  scale={bottomLeft(i, mapCount)}
                  geocoder={i === 0}
                  navigation={bottomRight(i, mapCount)}
                  miniMap={bottomRight(i, mapCount)}
                  spyglass={bottomRight(i, mapCount)}
                  layoutInvalidation={mapCount}
                  style={mapStyle.uri}
                  position={i}
                  sidebar={i === 0}
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
                style={{ transform: `translate(${compareRatio * bounds.width}px, 0px` }}
                onMouseDown={compareDown}
                onTouchStart={compareDown}
              >
                <div className={styles.swiper} />
              </div>
            )}
          </div>
        )}
      </Measure>
      {user && <Toolbar user={user} items={toolbarItems} />}
    </div>
  );
};

const bottomRight = (i, n) => i === n - 1;
const bottomLeft = (i, n) => (n === 4 ? i === 2 : i === 0);

export default MapLayout;
