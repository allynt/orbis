import React from 'react';

import styles from './quick-view.module.css';

const QuickView = () => (
  <div className={styles.quickView}>
    <div className={styles.content}>
      <div className={styles.column}>
        <h2>1</h2>
        <h3>Active Users</h3>
      </div>
      <div className={styles.column}>
        <h2>0</h2>
        <h3>Pending Invitations</h3>
      </div>
      <div className={styles.column}>
        <h2>19</h2>
        <h3>Licences Available</h3>
      </div>
    </div>
  </div>
);

export default QuickView;
