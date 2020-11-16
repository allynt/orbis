import React, { useState } from 'react';
import { ReactComponent as DragIcon } from './drag-and-drop.svg';
import { ReactComponent as ExpandIcon } from '../../triangle.svg';
import styles from './layers-list-item.module.css';

/**
 * @param {{
 *  children?: React.ReactNode
 *  title: string
 * }} props
 */
export const LayersListItem = ({ children, title }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={styles.layersListItem}>
      <button
        className={`${styles.button} ${expanded && styles.expanded}`}
        disabled={!children}
        onClick={() => setExpanded(e => !e)}
      >
        <DragIcon
          className={`${styles.icon} ${styles.dragIcon}`}
          title="Drag"
        />
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
