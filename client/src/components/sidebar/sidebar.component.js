import React from 'react';

import styles from './sidebar.module.css';

export const SidebarBottomItems = ({ children }) => <div className={styles.bottomItems}>{children}</div>;

export const Sidebar = ({ children, className, footer, header, logo }) => (
  <menu className={`${styles.sidebar} ${className}`}>
    {logo && <div className={styles.logo}>{logo}</div>}
    {header && <div className={styles.header}>{header}</div>}
    {children}
    {footer && <div className={styles.footer}>{footer}</div>}
  </menu>
);
