import React from 'react';

import styles from './loading-spinner.module.css';

export const LoadingSpinner = ({ fontSize = 'inherit' }) => (
  <div
    className={styles.loader}
    style={{ fontSize }}
    role="alert"
    aria-busy="true"
  >
    Loading...
  </div>
);
