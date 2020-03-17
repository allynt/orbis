import React from 'react';

import styles from './skeleton.module.css';

export const Skeleton = ({ className, width = '100%', height = '1.2rem', style }) => (
  <div className={`${styles.skeleton} ${className}`} style={{ width, height, ...style }} />
);
