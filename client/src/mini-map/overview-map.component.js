import React, { useImperativeHandle } from 'react';

import { useSelector } from 'react-redux';

import useMapbox from '../map/use-mapbox.hook';
import useMap from '../map/use-map.hook';

import layoutStyles from '../map/map-layout.module.css';
import styles from './overview-map.module.css';

const OverviewMap = ({ style }, ref) => {
  const accessToken = useSelector(state =>
    state.app.config ? state.app.config.mapbox_token : null,
  );

  const { mapContainer, mapInstance, mapPromise } = useMapbox(
    style,
    accessToken,
  );

  useMap(mapInstance, map => {
    map.on('load', event => event.target.resize());
  });

  useImperativeHandle(ref, () => mapPromise);

  return (
    <div
      ref={mapContainer}
      className={`${layoutStyles.map} ${styles.overviewMap}`}
      data-testid="overviewMap"
    ></div>
  );
};

export default React.memo(React.forwardRef(OverviewMap));
