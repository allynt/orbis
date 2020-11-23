import React from 'react';

import styles from './skeleton.module.css';

/**
 * @param {{
 *  className?: string
 *  width?: string | number
 *  height?: string | number
 *  style?:React.CSSProperties
 * }} props
 */
export const Skeleton = ({
  className,
  width = '100%',
  height = '1.2rem',
  style,
}) => (
  <div
    role="progressbar"
    className={`${styles.skeleton} ${className}`}
    style={{ width, height, ...style }}
  />
);
