import React, { useRef, useEffect, useState } from 'react';

import Measure from 'react-measure';

import Map from './map.component';
import syncMaps from './mapbox-gl-sync-move';
import syncOverviewMap from './mapbox-gl-sync-move-overview';
// import { useCrossFilterStore } from '../crossfilter';
import { useDispatch, useSelector } from 'react-redux';

// import Detail from '@astrosat/astrosat-ui/dist/containers/detail';
// import { Detail } from '@astrosat/astrosat-ui';

import { getToolbarItems } from '../toolbar/toolbar-config';

import Toolbar from '../toolbar/toolbar.component';
// import { colorSchemes } from '../colors';

import SideMenuContainer from '../side-menu/side-menu.container';
import AnnotationsPanel from '../annotations/annotations-panel.component';
import BookmarksPanel from '../bookmarks/bookmarks-panel.component';
import LayerTree from '../layer-tree/layer-tree.component';
import UpdateUserFormContainer from '../accounts/update-user-form.container';
// import PasswordChangeContainer from '../accounts/password-change-form.container';

import ComparisonMap from './compare-maps.component';
import OverviewMap from '../mini-map/overview-map.component';
import SpyglassMap from '../spyglass/spyglass-map.component';

import styles from './map-layout.module.css';

const times = (n, fn) => {
  const result = [];
  for (let i = 0; i < n; i++) {
    result.push(fn(i));
  }
  return result;
};

const MapLayout = ({ count }) => {
  const dispatch = useDispatch();
  // const multi = useSelector(state => state.map.isMultiMapMode);
  const map1Ref = useRef(null);
  const map2Ref = useRef(null);
  const map3Ref = useRef(null);
  const map4Ref = useRef(null);

  const overviewMapRef = useRef(null);
  const spyglassMapRef = useRef(null);
  const [maps, setMaps] = useState(null);

  const divRef = useRef(null);
  // const [bounds, setBounds] = useState(null);

  const isOverviewMapVisible = useSelector(state => state.map.isMiniMapVisible);
  const isSpyglassMapVisible = useSelector(state => state.map.isSpyglassMapVisible);
  const isCompareMode = useSelector(state => state.map.isCompareMode);
  const overviewMapStyle = { uri: 'mapbox://styles/mapbox/streets-v11' };

  const openFeature = useSelector(state => state.sidebar.visibleMenuItem);

  // Since we have no data I have started passing in the
  // number of maps to create as a prop. This is likely to
  // change in the future, once we have some data. I have
  // also heard we don't want multi-maps, but I'm not sure
  // that has been agreed yet. For now, we will hard-code
  // the number of maps to be one.
  // const mapCount = count;
  const mapCount = isCompareMode ? 2 : 1;
  const mapRefs = [map1Ref, map2Ref, map3Ref, map4Ref];
  const mapRefCount = mapRefs.filter(ref => ref.current).length;

  const overviewMapRefCount = [overviewMapRef].filter(ref => ref.current).length;
  const spyglassMapRefCount = [spyglassMapRef].filter(ref => ref.current).length;

  const mapStyle = useSelector(state => state.map.selectedMapStyle);

  useEffect(() => {
    if (mapRefCount > 1) {
      const removeSyncMove = Promise.all(
        [map1Ref.current, map2Ref.current, map3Ref.current, map4Ref.current].filter(ref => ref)
      ).then(maps => syncMaps(maps));

      return () => {
        removeSyncMove.then(cb => cb());
      };
    } else {
      Promise.all([map1Ref.current].filter(ref => ref)).then(maps => setMaps(maps));
    }
  }, [mapRefCount]);

  useEffect(() => {
    if (isOverviewMapVisible) {
      const removeSyncMove = Promise.all([overviewMapRef.current].filter(ref => ref)).then(overviewMap =>
        syncOverviewMap([maps[0], ...overviewMap])
      );

      return () => {
        removeSyncMove.then(cb => cb());
      };
    }
  }, [overviewMapRefCount, isOverviewMapVisible]);

  useEffect(() => {
    if (isSpyglassMapVisible) {
      const removeSyncMove = Promise.all([spyglassMapRef.current].filter(ref => ref)).then(spyglassMap =>
        syncMaps([maps[0], ...spyglassMap])
      );

      return () => {
        removeSyncMove.then(cb => cb());
      };
    }
  }, [spyglassMapRefCount, isSpyglassMapVisible]);

  useEffect(() => {
    if (divRef.current) {
      // console.log('SETTING BOUNDS');
      setBounds(divRef.current.getBoundingClientRect());
    }
  }, []);

  const toolbarItems = getToolbarItems(dispatch);

  // const compareRatio = 0.5;
  // const dimensions = { width: 1305, height: 803 };

  const [bounds, setBounds] = useState(null);
  const [compareRatio, setCompareRatio] = useState(0.5);
  const [dimensions, setDimensions] = useState({ width: 1305, height: 803 });

  const compareMove = event => {
    // console.log('COMPARE MOVE: ', event);
    event = event.touches ? event.touches[0] : event;
    let x = event.clientX - bounds.left;
    if (x < 0) x = 0;
    if (x > bounds.width) x = bounds.width;
    const ratio = x / bounds.width;
    // props.layerActions.moveCompare(ratio);
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
    // console.log('MOUSE DOWN');
    if (event.touches) {
      document.addEventListener('touchmove', compareMove);
      document.addEventListener('touchend', compareTouchEnd);
    } else {
      document.addEventListener('mousemove', compareMove);
      document.addEventListener('mouseup', compareMouseEnd);
    }
  };

  return (
    <div ref={divRef} className={styles['map-column']}>
      <Measure
        bounds
        onResize={contentRect => {
          const { width, height } = contentRect.bounds;
          // console.log('SETTING DIMENSIONS: ', { width, height });
          // setDimensions({ width, height });
        }}
      >
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
                        clip: `rect(0px, 999em, ${dimensions.height}px, ${compareRatio * dimensions.width}px)`
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
                  style={mapStyle.uri}
                  position={i}
                  sidebar={i === 0}
                  compare={isCompareMode}
                  compareRatio={compareRatio}
                  // dimensions={dimensions}
                />
                {i === 0 && isCompareMode && (
                  <div
                    className={styles.compare}
                    style={{ transform: `translate(${compareRatio * dimensions.width}px, 0px` }}
                    onMouseDown={compareDown}
                    onTouchStart={compareDown}
                  >
                    <div className={styles.swiper} />
                  </div>
                )}
              </div>
            ))}
            {isOverviewMapVisible && <OverviewMap ref={overviewMapRef} style={overviewMapStyle.uri} />}
            {isSpyglassMapVisible && <SpyglassMap ref={spyglassMapRef} style={mapStyle.uri} />}
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
