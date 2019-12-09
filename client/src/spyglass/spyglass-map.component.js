import React, { useImperativeHandle } from 'react';

import { useSelector } from 'react-redux';

import useMapbox from '../map/use-mapbox.hook';
import useMap from '../map/use-map.hook';

import layoutStyles from '../map/map-layout.module.css';
import styles from './spyglass-map.module.css';

const SpyglassMap = ({ style }, ref) => {
  const accessToken = useSelector(state => (state.app.config ? state.app.config.mapbox_token : null));

  const { mapContainer, mapInstance, mapPromise } = useMapbox(style, accessToken);

  useMap(mapInstance, map => {
    map.on('load', event => event.target.resize());
  });

  useImperativeHandle(ref, () => mapPromise);

  return (
    <div ref={mapContainer} className={`${layoutStyles.map} ${styles.spyglassMap}`} data-testid="spyglassMap">
      <div className={styles.handle}>DRAG</div>
    </div>
  );
};

export default React.memo(React.forwardRef(SpyglassMap));
