import React from 'react';

import styles from './quick-view.module.css';

const QuickView = ({ data }) => (
  <div className={styles.quickView}>
    <div className={styles.column}>
      <h2 className={styles.value}>{data?.active ? data.active : '-'}</h2>
      <h3 className={styles.title}>Active Users</h3>
    </div>
    <div className={styles.column}>
      <h2 className={styles.value}>{data?.pending ? data.pending : '-'}</h2>
      <h3 className={styles.title}>Pending Invitations</h3>
    </div>
    <div className={styles.column}>
      <h2 className={styles.value}>{data?.available ? data.available : '-'}</h2>
      <h3 className={styles.title}>Licences Available</h3>
    </div>
  </div>
);

export default QuickView;
