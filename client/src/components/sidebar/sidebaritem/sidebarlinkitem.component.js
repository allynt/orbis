import React from 'react';
import { SidebarItem } from './sidebaritem.component';

export const SidebarLinkItem = ({ children, href, icon, rel, target, tooltip }) => (
  <a href={href} rel={rel} target={target}>
    <SidebarItem children={children} icon={icon} tooltip={tooltip} />
  </a>
);
