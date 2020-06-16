import React from 'react';
import styles from './sidebaritem.module.css';
import ReactTooltip from 'react-tooltip';

export const SidebarItem = ({ children, icon, selected, tooltip, onClick }) => (
  <li className={`${styles.sidebarItem} ${selected && styles.selected}`} onClick={onClick}>
    {icon && <div className={styles.icon}>{icon}</div>}
    {children && <div className={styles.label}>{children}</div>}
    <ReactTooltip id={`toolbar-item-${tooltip}-tooltip`}>
      <span>{tooltip}</span>
    </ReactTooltip>
  </li>
);
