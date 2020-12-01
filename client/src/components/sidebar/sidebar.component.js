import { List, styled } from '@astrosat/astrosat-ui';
import React from 'react';

import styles from './sidebar.module.css';

export const SidebarBottomItems = ({ children }) => (
  <div className={styles.bottomItems}>{children}</div>
);

const Nav = styled('nav')(({ theme }) => ({
  height: '100vh',
  width: 'fit-content',
  paddingBottom: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  flexShrink: 0,
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.background.default,
  borderRight: `2px solid ${theme.palette.primary.main}`,
  overflowX: 'hidden',
}));

/**
 * @param {{
 *  children?: React.ReactNode
 *  className?: string
 *  footer?: React.ReactNode
 *  header?: React.ReactNode
 *  logo?: React.ReactNode
 * }} props
 */
export const Sidebar = ({ children, className, footer, header, logo }) => (
  <Nav className={className}>
    {logo && <div className={styles.logo}>{logo}</div>}
    {header && <header className={styles.header}>{header}</header>}
    <List className={styles.items}>{children}</List>
    {footer && <footer className={styles.footer}>{footer}</footer>}
  </Nav>
);
