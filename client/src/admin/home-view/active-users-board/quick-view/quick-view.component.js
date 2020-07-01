import React from 'react';

import styles from './quick-view.module.css';

const QuickView = ({ licenceData }) => (
  <div className={styles.quickView}>
    <div className={styles.content}>
      <div className={styles.column}>
        <h2 className={styles.value}>{licenceData.active}</h2>
        <h3 className={styles.title}>Active Users</h3>
      </div>
      <div className={styles.column}>
        <h2 className={styles.value}>{licenceData.pending}</h2>
        <h3 className={styles.title}>Pending Invitations</h3>
      </div>
      <div className={styles.column}>
        <h2 className={styles.value}>{licenceData.available}</h2>
        <h3 className={styles.title}>Licences Available</h3>
      </div>
    </div>
  </div>
);

export default QuickView;
