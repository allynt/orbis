import React, { useRef, useEffect, useState } from 'react';

import Measure from 'react-measure';

import Map from './map.component';
import syncMaps from './mapbox-gl-sync-move';
import syncOverviewMap from './mapbox-gl-sync-move-overview';
import { useDispatch, useSelector } from 'react-redux';

import { getToolbarItems } from '../toolbar/toolbar-config';

import Toolbar from '../toolbar/toolbar.component';

import { moveCompare } from './map.actions';

import styles from './map-layout.module.css';

const mapstyles = ['mapbox://styles/mapbox/streets-v11', 'mapbox://styles/mapbox/satellite-v9'];

const times = (n, fn) => {
  const result = [];
  for (let i = 0; i < n; i++) {
    result.push(fn(i));
  }
  return result;
};

const MapLayout = () => {
  const dispatch = useDispatch();

  const toolbarItems = getToolbarItems(dispatch);

  const mapStyle = useSelector(state => state.map.selectedMapStyle);

  const compareRatio = useSelector(state => state.map.compareRatio);
  console.log('COMPARE RATIO: ', compareRatio);
  const [bounds, setBounds] = useState({ top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0 });

  const compareMove = event => {
    event = event.touches ? event.touches[0] : event;
    let x = event.clientX - bounds.left;
    if (x < 0) x = 0;
    if (x > bounds.width) x = bounds.width;
    const ratio = x / bounds.width;
    dispatch(moveCompare(ratio));
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
    if (event.touches) {
      document.addEventListener('touchmove', compareMove);
      document.addEventListener('touchend', compareTouchEnd);
    } else {
      document.addEventListener('mousemove', compareMove);
      document.addEventListener('mouseup', compareMouseEnd);
    }
  };

  const map1Ref = useRef(null);
  const map2Ref = useRef(null);
  const isCompareMode = useSelector(state => state.map.isCompareMode);
  const mapCount = isCompareMode ? 2 : 1;
  const mapRefs = [map1Ref, map2Ref];
  const mapRefCount = [map1Ref, map2Ref].filter(ref => ref.current).length;

  useEffect(() => {
    if (mapCount > 1) {
      const removeSyncMove = Promise.all([map1Ref.current, map2Ref.current])
        .then(maps => {
          syncMaps(maps);
        })
        .catch(error => console.log('ERROR: ', error))
        .finally(() => console.log('FINISHED'));

      return () => {
        removeSyncMove.then(cb => cb());
      };
    }
  }, [mapCount]);

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
                        clip: `rect(0px, 999em, 100vh, ${compareRatio * bounds.width}px)`
                      }
                }
              >
                <Map
                  ref={mapRefs[i]}
                  attribution={bottomRight(i, mapCount)}
                  scale={bottomLeft(i, mapCount)}
                  geocoder={i === 0}
                  navigation={bottomRight(i, mapCount)}
                  miniMap={bottomRight(i, mapCount)}
                  spyglass={bottomRight(i, mapCount)}
                  layoutInvalidation={mapCount}
                  style={mapstyles[i]}
                  // style={mapStyle.uri} // FIXME:Add me back in, only for dev purposes
                  position={i}
                  sidebar={i === 0}
                  compare={isCompareMode}
                  compareRatio={compareRatio}
                />
                {i === 0 && isCompareMode && (
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
            ))}
          </div>
        )}
      </Measure>

      <Toolbar items={toolbarItems} />
    </div>
  );
};

const bottomRight = (i, n) => i === n - 1;
const bottomLeft = (i, n) => (n === 4 ? i === 2 : i === 0);

export default MapLayout;
