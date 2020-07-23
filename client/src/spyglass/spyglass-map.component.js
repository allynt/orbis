import React from 'react';

import { useSelector } from 'react-redux';

import layoutStyles from '../map/map-layout.module.css';
import styles from './spyglass-map.module.css';

const SpyglassMap = ({ style }, ref) => {
  const accessToken = useSelector(state =>
    state.app.config ? state.app.config.mapbox_token : null,
  );

  return (
    <div
      className={`${layoutStyles.map} ${styles.spyglassMap}`}
      data-testid="spyglassMap"
    >
      <div className={styles.handle}>DRAG</div>
    </div>
  );
};

export default React.memo(React.forwardRef(SpyglassMap));
