import React from 'react';

import { ProfileIcon } from '@astrosat/astrosat-ui';

import { action } from '@storybook/addon-actions';

import { SidebarItem } from './sidebar-item.component';

const Index = {
  title: 'Components/Sidebar/SidebarItem',
  component: SidebarItem,
};
export default Index;

const IconTemplate = ({ selected }) => (
  <>
    <SidebarItem
      icon={<ProfileIcon />}
      selected={selected}
      tooltip="only icon"
      onClick={action('onClick')}
    />
  </>
);
export const Icon = IconTemplate.bind({});
Icon.args = { selected: false };

const LabelTemplate = ({ selected }) => (
  <SidebarItem selected={selected} onClick={action('onClick')}>
    Item Label
  </SidebarItem>
);
export const Label = LabelTemplate.bind({});
Label.args = { selected: false };

const IconAndLabelTemplate = ({ selected }) => (
  <SidebarItem
    icon={<ProfileIcon />}
    selected={selected}
    onClick={action('onClick')}
  >
    Item Label
  </SidebarItem>
);
export const IconAndLabel = IconAndLabelTemplate.bind({});
IconAndLabel.args = { selected: false };

export const LinkItemTemplate = ({ selected }) => (
  <SidebarItem
    icon={<ProfileIcon />}
    selected={selected}
    href="https://www.google.com"
    rel="noopener noreferrer"
    target="_blank"
  >
    Item Label
  </SidebarItem>
);
export const LinkItem = LinkItemTemplate.bind({});
LinkItem.args = { selected: false };
