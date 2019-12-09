import React, { useRef, useEffect, useState } from 'react';
import Map from './map.component';
import syncMaps from './mapbox-gl-sync-move';
import syncOverviewMap from './mapbox-gl-sync-move-overview';
// import { useCrossFilterStore } from '../crossfilter';
import { useDispatch, useSelector } from 'react-redux';

import { getToolbarItems } from '../toolbar/toolbar-config';

import Toolbar from '../toolbar/toolbar.component';
// import { colorSchemes } from '../colors';

import OverviewMap from '../mini-map/overview-map.component';

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
  const [maps, setMaps] = useState(null);
  const isOverviewMapVisible = useSelector(state => state.map.isMiniMapVisible);
  const overviewMapStyle = { uri: 'mapbox://styles/mapbox/streets-v11' };

  const mapCount = count;
  const mapRefs = [map1Ref, map2Ref, map3Ref, map4Ref];
  const mapRefCount = mapRefs.filter(ref => ref.current).length;

  const overviewMapRefCount = [overviewMapRef].filter(ref => ref.current).length;

  const mapStyle = useSelector(state => state.map.selectedMapStyle);

  useEffect(() => {
    if (mapRefCount > 1) {
      const removeSyncMove = Promise.all(
        [map1Ref.current, map2Ref.current, map3Ref.current, map4Ref.current].filter(ref => ref)
      ).then(maps => {
        setMaps(maps);
        syncMaps(maps);
      });

      return () => {
        removeSyncMove.then(cb => cb());
      };
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

  const toolbarItems = getToolbarItems(dispatch);

  return (
    <div className={styles['map-column']}>
      <div
        className={`${styles.layout} ${styles[`layout-${mapCount}`]}`}
        data-testid="map-container"
      >
        {times(mapCount, i => (
          <Map
            key={i}
            ref={mapRefs[i]}
            // selectedProperty={multi ? properties[i].field : selectedProperty}
            // colorScheme={
            //   colorSchemes[
            //     multi
            //       ? i
            //       : properties.indexOf(
            //           properties.find(
            //             property => property.field === selectedProperty
            //           )
            //         )
            //   ]
            // }
            attribution={bottomRight(i, mapCount)}
            scale={bottomLeft(i, mapCount)}
            geocoder={i === 0}
            navigation={bottomRight(i, mapCount)}
            miniMap={bottomRight(i, mapCount)}
            spyglass={bottomRight(i, mapCount)}
            layoutInvalidation={mapCount}
            style={mapStyle.uri}
            position={i}
          />
        ))}
        {isOverviewMapVisible && (
          <OverviewMap ref={overviewMapRef} style={overviewMapStyle.uri} />
        )}
      </div>

      <Toolbar items={toolbarItems} />
    </div>
  );
};

const bottomRight = (i, n) => i === n - 1;
const bottomLeft = (i, n) => (n === 4 ? i === 2 : i === 0);

export default MapLayout;
