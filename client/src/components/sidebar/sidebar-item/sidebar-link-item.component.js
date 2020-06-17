import React from 'react';
import styles from './sidebaritem.module.css';
import { SidebarItemInner } from './sidebar-item-inner.component';

export const SidebarLinkItem = ({ children, href, icon, rel, target, tooltip }) => (
  <a className={styles.sidebarItem} href={href} rel={rel} target={target}>
    <SidebarItemInner children={children} icon={icon} tooltip={tooltip} />
  </a>
);
