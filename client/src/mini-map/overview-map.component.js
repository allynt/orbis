import React from 'react';

import { useSelector } from 'react-redux';

import layoutStyles from '../map/map-layout.module.css';
import styles from './overview-map.module.css';

const OverviewMap = ({ style }, ref) => {
  const accessToken = useSelector(state =>
    state.app.config ? state.app.config.mapbox_token : null,
  );

  return (
    <div
      className={`${layoutStyles.map} ${styles.overviewMap}`}
      data-testid="overviewMap"
    ></div>
  );
};

export default React.memo(React.forwardRef(OverviewMap));
