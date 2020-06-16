import React from 'react';
import styles from './sidebar.module.css';

export const SidebarTopItems = ({ children }) => <div>{children}</div>;
export const SidebarBottomItems = ({ children }) => <div>{children}</div>;

export const SidebarItem = ({ children }) => <div>{children}</div>;

export const Sidebar = ({ children, logo }) => (
  <menu className={styles.sidebar}>
    {logo && <div className={styles.logo}>{logo}</div>}
    {children}
  </menu>
);
