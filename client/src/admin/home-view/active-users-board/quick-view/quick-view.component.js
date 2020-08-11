import React from 'react';

import styles from './quick-view.module.css';

const QuickView = ({ quickViewData }) => (
  <div className={styles.quickView}>
    <div className={styles.column}>
      <h2 className={styles.value}>
        {quickViewData?.active ? quickViewData.active : '-'}
      </h2>
      <h3 className={styles.title}>Active Users</h3>
    </div>
    <div className={styles.column}>
      <h2 className={styles.value}>
        {quickViewData?.pending ? quickViewData.pending : '-'}
      </h2>
      <h3 className={styles.title}>Pending Invitations</h3>
    </div>
    <div className={styles.column}>
      <h2 className={styles.value}>
        {quickViewData?.available ? quickViewData.available : '-'}
      </h2>
      <h3 className={styles.title}>Licences Available</h3>
    </div>
  </div>
);

export default QuickView;
