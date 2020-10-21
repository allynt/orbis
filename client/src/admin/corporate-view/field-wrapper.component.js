import React from 'react';

import styles from './corporate-view.module.css';

export const FieldWrapper = ({ children }) => (
  <div className={styles.fieldWrapper}>{children}</div>
);
