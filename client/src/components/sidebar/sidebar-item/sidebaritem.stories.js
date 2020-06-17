import { ProfileIcon } from '@astrosat/astrosat-ui';
import { action } from '@storybook/addon-actions';
import { boolean } from '@storybook/addon-knobs';
import React from 'react';
import { SidebarItem } from './sidebar-item.component';
import { SidebarLinkItem } from './sidebar-link-item.component';

export default { title: 'Components/Sidebar/SidebarItem' };

export const Icon = () => (
  <SidebarItem
    icon={<ProfileIcon style={{ width: '100%' }} />}
    selected={boolean('Selected', false)}
    tooltip="only icon"
    onClick={action('onClick')}
  />
);

export const Label = () => (
  <SidebarItem selected={boolean('Selected', false)} onClick={action('onClick')}>
    Item Label
  </SidebarItem>
);

export const IconAndLabel = () => (
  <SidebarItem
    icon={<ProfileIcon style={{ width: '100%' }} />}
    selected={boolean('Selected', false)}
    onClick={action('onClick')}
  >
    Item Label
  </SidebarItem>
);

export const LinkItem = () => (
  <SidebarLinkItem
    icon={<ProfileIcon style={{ width: '100%' }} />}
    href="https://www.google.com"
    rel="noopener noreferrer"
    target="_blank"
  >
    Item Label
  </SidebarLinkItem>
);
