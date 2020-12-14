import clsx from 'clsx';
import * as React from 'react';

import styles from './side-panel.module.css';

/**
 * @param {{
 *  children?: React.ReactNode
 *  className?: string
 *  header?: React.ReactNode
 *  orientation?: 'left' | 'right'
 * }} props
 */
export const SidePanel = ({
  children,
  className,
  header,
  orientation = 'left',
}) => (
  <div className={clsx(styles.sidePanel, styles[orientation], className)}>
    {header && <div className={styles.header}>{header}</div>}
    <div className={styles.content}>{children}</div>
  </div>
);
