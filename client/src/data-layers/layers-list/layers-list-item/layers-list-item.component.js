import React, { useState } from 'react';
import { ReactComponent as ExpandIcon } from '../../triangle.svg';
import styles from './layers-list-item.module.css';

/**
 * @param {{
 *  children?: React.ReactNode
 *  title: string
 *  defaultExpanded?: boolean
 * }} props
 */
export const LayersListItem = ({
  children,
  title,
  defaultExpanded = false,
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div className={styles.layersListItem}>
      <button
        className={`${styles.button} ${expanded && styles.expanded}`}
        disabled={!children}
        onClick={() => setExpanded(e => !e)}
      >
        {title}
        {children && (
          <ExpandIcon
            className={`${styles.icon} ${styles.expandIcon} ${
              expanded && styles.expanded
            }`}
            title="Expand"
          />
        )}
      </button>
      <div className={`${styles.children} ${expanded && styles.expanded}`}>
        {expanded && children}
      </div>
    </div>
  );
};
