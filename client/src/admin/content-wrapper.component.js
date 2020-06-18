import React from 'react';

import styles from './content-wrapper.module.css';

const ContentWrapper = ({ children, title }) => (
  <div className={styles.contentPanel}>
    <h1 className={styles.title}>{title}</h1>
    {children}
  </div>
);

export default ContentWrapper;
