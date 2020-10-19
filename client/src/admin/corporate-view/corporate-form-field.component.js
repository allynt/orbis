import React from 'react';

import styles from './corporate-view.module.css';

export const Field = ({ children }) => (
  <div className={styles.fieldContainer}>{children}</div>
);
