import React from 'react';
import styles from './sidebar.module.css';

export const SidebarTopItems = ({ children }) => <div>{children}</div>;

export const SidebarBottomItems = ({ children }) => <div className={styles.bottomItems}>{children}</div>;

export const Sidebar = ({ children, footer, header, logo }) => (
  <menu className={styles.sidebar}>
    {logo && <div className={styles.logo}>{logo}</div>}
    {header && <div className={styles.header}>{header}</div>}
    {children}
    {footer && <div className={styles.footer}>{footer}</div>}
  </menu>
);
