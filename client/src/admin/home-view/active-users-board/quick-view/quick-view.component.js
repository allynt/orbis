import React from 'react';

import styles from './quick-view.module.css';

// Adding comment so I can push again
const QuickView = ({ licenceData }) => (
  <div className={styles.quickView}>
    <div className={styles.column}>
      <h2 className={styles.value}>{licenceData ? licenceData.active : '-'}</h2>
      <h3 className={styles.title}>Active Users</h3>
    </div>
    <div className={styles.column}>
      <h2 className={styles.value}>
        {licenceData ? licenceData.pending : '-'}
      </h2>
      <h3 className={styles.title}>Pending Invitations</h3>
    </div>
    <div className={styles.column}>
      <h2 className={styles.value}>
        {licenceData ? licenceData.available : '-'}
      </h2>
      <h3 className={styles.title}>Licences Available</h3>
    </div>
  </div>
);

export default QuickView;
