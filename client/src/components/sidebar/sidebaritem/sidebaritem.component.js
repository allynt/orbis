import React from 'react';
import styles from './sidebaritem.module.css';
import ReactTooltip from 'react-tooltip';

export const SidebarItem = ({ children, icon, selected, tooltip, onClick }) => (
  <li
    className={`${styles.sidebarItem} ${selected && styles.selected}`}
    onClick={onClick}
    data-tip
    data-for={`toolbar-item-${tooltip}-tooltip`}
  >
    {icon && <div className={styles.icon}>{icon}</div>}
    {children && <div className={styles.label}>{children}</div>}
    {tooltip && <ReactTooltip id={`toolbar-item-${tooltip}-tooltip`}>{tooltip}</ReactTooltip>}
  </li>
);
