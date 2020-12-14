import clsx from 'clsx';
import * as React from 'react';

import styles from './side-panel.module.css';

/**
 * @param {{
 *  children?: React.ReactNode
 *  className?: string
 *  contentClassName?: string
 *  header?: React.ReactNode
 *  open?: boolean
 *  orientation?: 'left' | 'right'
 * }} props
 */
export const SidePanel = ({
  children,
  className,
  contentClassName,
  header,
  open = false,
  orientation = 'left',
}) => (
  <div
    className={clsx(className, styles.sidePanel, styles[orientation], {
      [styles.open]: open,
    })}
  >
    {header && <div className={styles.header}>{header}</div>}
    <div className={clsx(styles.content, contentClassName)}>{children}</div>
  </div>
);
