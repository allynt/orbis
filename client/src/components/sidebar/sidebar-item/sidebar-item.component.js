import React from 'react';

import { SidebarItemInner } from './sidebar-item-inner.component';

import styles from './sidebar-item.module.css';

export const SidebarItem = ({ children, icon, selected, tooltip, onClick }) => (
  <li
    tabIndex="1"
    className={`${styles.sidebarItem} ${children && styles.withLabel} ${selected && styles.selected}`}
    onClick={onClick}
    onKeyUp={e => (e.keyCode === 32 || e.keyCode === 13) && onClick && onClick(e)}
    data-tip
    data-for={`toolbar-item-${tooltip}-tooltip`}
  >
    <SidebarItemInner children={children} icon={icon} tooltip={tooltip} />
  </li>
);