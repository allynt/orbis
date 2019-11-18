import React, { useRef } from 'react';
import Map from './map.component';
// import syncMove from './mapbox-gl-sync-move';
// import { useCrossFilterStore } from '../crossfilter';
import { useDispatch, useSelector } from 'react-redux';

import { ReactComponent as BookmarksLogo } from '../toolbar/menu.svg';
import { ReactComponent as AnnotationsLogo } from '../toolbar/satellite-acquisitions.svg';

import Toolbar from '../toolbar/toolbar.component';
import { toggleMenu } from '../side-menu/side-menu.actions';
// import { colorSchemes } from '../colors';

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
  // const multi = useSelector(state => state.map.isMultiMapMode);
  const map1Ref = useRef(null);
  const map2Ref = useRef(null);
  const map3Ref = useRef(null);
  const map4Ref = useRef(null);
  // const index = useCrossFilterStore();
  // const properties = index.properties();
  // const selectedProperty = index.selectedProperty();
  // const mapCount = multi ? properties.length : 1;
  const mapCount = 1;
  const mapRefs = [map1Ref, map2Ref, map3Ref, map4Ref];
  // const mapRefCount = mapRefs.filter(ref => ref.current).length;
  const mapStyle = useSelector(state => state.map.selectedMapStyle);

  // useEffect(() => {
  //   if (mapRefCount > 1) {
  //     const removeSyncMove = syncMove(
  //       [map1Ref.current, map2Ref.current, map3Ref.current, map4Ref.current].filter(ref => ref)
  //     );
  //     return () => {
  //       removeSyncMove();
  //     };
  //   }
  // }, [mapRefCount]);

  const toolbarItems = [
    {
      label: 'Bookmarks',
      icon: <BookmarksLogo />,
      action: () => dispatch(toggleMenu()),
      tooltip: 'Bookmarks'
    },
    {
      label: 'Annotations',
      icon: <AnnotationsLogo />,
      action: () => console.log('Show Annotations'),
      tooltip: 'Annotations'
    }
  ];

  return (
    <div className={styles['map-column']}>
      <div className={`${styles.layout} ${styles[`layout-${mapCount}`]}`} data-testid="map-container">
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
            layoutInvalidation={mapCount}
            style={mapStyle.uri}
            position={i}
          />
        ))}
      </div>

      <Toolbar items={toolbarItems} />
    </div>
  );
};

const bottomRight = (i, n) => i === n - 1;
const bottomLeft = (i, n) => (n === 4 ? i === 2 : i === 0);

export default MapLayout;
