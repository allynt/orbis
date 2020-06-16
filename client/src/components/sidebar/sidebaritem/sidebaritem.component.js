import React from 'react';
import styles from './sidebaritem.module.css';

export const SidebarItem = ({ children, icon }) => (
  <div className={styles.sidebarItem}>
    {icon && <div className={styles.icon}>{icon}</div>}
    {children && <div className={styles.label}>{children}</div>}
  </div>
);
