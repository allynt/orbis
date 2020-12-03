import React from 'react';

import { ProfileIcon } from '@astrosat/astrosat-ui';

import { action } from '@storybook/addon-actions';
import { boolean } from '@storybook/addon-knobs';

import { SidebarItem } from './sidebar-item.component';

export default { title: 'Components/Sidebar/SidebarItem' };

export const Icon = () => (
  <>
    <SidebarItem
      icon={<ProfileIcon />}
      selected={boolean('Selected', false)}
      tooltip="only icon"
      onClick={action('onClick')}
    />
  </>
);

export const Label = () => (
  <SidebarItem
    selected={boolean('Selected', false)}
    onClick={action('onClick')}
  >
    Item Label
  </SidebarItem>
);

export const IconAndLabel = () => (
  <SidebarItem
    icon={<ProfileIcon />}
    selected={boolean('Selected', false)}
    onClick={action('onClick')}
  >
    Item Label
  </SidebarItem>
);

export const LinkItem = () => (
  <SidebarItem
    icon={<ProfileIcon />}
    href="https://www.google.com"
    rel="noopener noreferrer"
    target="_blank"
  >
    Item Label
  </SidebarItem>
);
