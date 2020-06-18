import React from 'react';

import styles from './admin.module.css';

const AdminWrapper = ({ children, title }) => (
  <div className={styles.contentPanel}>
    <h1 className={styles.title}>{title}</h1>
    {children}
  </div>
);

export default AdminWrapper;
