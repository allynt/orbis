import React from 'react';

import {
  ProfileIcon,
  SatelliteIcon,
  DataIcon,
  Typography,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@astrosat/astrosat-ui';

import { OrbisLogo } from 'components';

import { Sidebar, SidebarItem, SidebarBottomItems } from '.';

const logoStyle = { height: '54px' };

const AdminHeader = () => (
  <ListItem>
    <ListItemIcon>
      <ProfileIcon />
    </ListItemIcon>
    <ListItemText
      primary={<Typography variant="h2">Adam Raymond</Typography>}
      secondary={<Typography variant="h5">Administrator</Typography>}
    />
  </ListItem>
);

const Index = { title: 'Components/Sidebar', component: Sidebar };

export default Index;

const Template = args => <Sidebar {...args} />;

export const Nothing = Template.bind({});

export const Logo = Template.bind({});
Logo.args = {
  logo: <OrbisLogo style={logoStyle} />,
};

export const Header = Template.bind({});
Header.args = {
  header: <AdminHeader />,
};

export const Items = Template.bind({});
Items.args = {
  children: (
    <>
      <SidebarItem icon={<ProfileIcon />} selected />
      <SidebarItem icon={<SatelliteIcon />} />
      <SidebarItem icon={<DataIcon />} />
    </>
  ),
};

export const ItemsWithLabels = Template.bind({});
ItemsWithLabels.args = {
  children: (
    <>
      <SidebarItem icon={<ProfileIcon />} selected>
        Item one
      </SidebarItem>
      <SidebarItem icon={<SatelliteIcon />}>Item two</SidebarItem>
      <SidebarItem icon={<DataIcon />}>Item three</SidebarItem>
    </>
  ),
};

export const ItemPosition = Template.bind({});
ItemPosition.args = {
  children: (
    <>
      <SidebarItem icon={<ProfileIcon />} selected>
        Item one
      </SidebarItem>
      <SidebarItem icon={<SatelliteIcon />}>Item two</SidebarItem>
      <SidebarItem icon={<DataIcon />}>Item three</SidebarItem>
      <SidebarBottomItems>
        <SidebarItem icon={<ProfileIcon />}>Item four</SidebarItem>
        <SidebarItem icon={<SatelliteIcon />}>Item five</SidebarItem>
        <SidebarItem icon={<DataIcon />}>Item six</SidebarItem>
      </SidebarBottomItems>
    </>
  ),
};

export const Footer = Template.bind({});
Footer.args = {
  footer: <Typography variant="h3">This is the footer</Typography>,
};

export const KitchenSink = Template.bind({});
KitchenSink.args = {
  ...Logo.args,
  ...Header.args,
  ...Footer.args,
  ...ItemPosition.args,
};
