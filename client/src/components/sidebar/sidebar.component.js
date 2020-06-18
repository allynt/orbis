import React from 'react';

import styles from './sidebar.module.css';

export const SidebarBottomItems = ({ children }) => <div className={styles.bottomItems}>{children}</div>;

export const Sidebar = ({ children, className, footer, header, logo }) => (
  <nav className={`${styles.sidebar} ${className}`}>
    {logo && <div className={styles.logo}>{logo}</div>}
    {header && <header className={styles.header}>{header}</header>}
    {children}
    {footer && <footer className={styles.footer}>{footer}</footer>}
  </nav>
);
