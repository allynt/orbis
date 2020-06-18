import React from 'react';

import ReactTooltip from 'react-tooltip';

import styles from './sidebar-item.module.css';

export const SidebarItemInner = ({ children, icon, tooltip }) => (
  <>
    {icon && <div className={styles.icon}>{icon}</div>}
    {children && <div className={styles.label}>{children}</div>}
    {tooltip && <ReactTooltip id={`toolbar-item-${tooltip}-tooltip`}>{tooltip}</ReactTooltip>}
  </>
);
