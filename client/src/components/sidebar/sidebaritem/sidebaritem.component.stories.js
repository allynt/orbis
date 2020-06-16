import React from 'react';
import { ProfileIcon } from '@astrosat/astrosat-ui';
import { SidebarItem } from './sidebaritem.component';

export default { title: 'Components/Sidebar/SidebarItem' };

export const Icon = () => <SidebarItem icon={<ProfileIcon style={{ width: '100%' }} />} />;

export const Label = () => <SidebarItem>Item Label</SidebarItem>;

export const IconAndLabel = () => (
  <SidebarItem icon={<ProfileIcon style={{ width: '100%' }} />}>Item Label</SidebarItem>
);
