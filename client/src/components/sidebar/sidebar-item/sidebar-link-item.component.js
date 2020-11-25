import React from 'react';

import { SidebarItemInner } from './sidebar-item-inner.component';

import styles from './sidebar-item.module.css';

/**
 * @deprecated
 */
export const SidebarLinkItem = ({
  children,
  href,
  icon,
  rel,
  target,
  tooltip,
}) => (
  <a
    className={`${styles.sidebarItem} ${children && styles.withLabel}`}
    href={href}
    rel={rel}
    target={target}
  >
    <SidebarItemInner children={children} icon={icon} tooltip={tooltip} />
  </a>
);
