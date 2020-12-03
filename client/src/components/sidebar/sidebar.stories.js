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

import { Sidebar, SidebarItem, SidebarBottomItems } from '.';

import { ReactComponent as OrbisLogo } from '../../orbis-light.svg';
import { ReactComponent as OrbisAdminLogo } from '../../admin/orbis-admin-logo.svg';

const logoStyle = { height: '33px', color: '#fff' };

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

export default { title: 'Components/Sidebar', component: Sidebar };

export const Nothing = () => <Sidebar />;

export const Logo = () => <Sidebar logo={<OrbisLogo style={logoStyle} />} />;

export const Header = () => <Sidebar header={<AdminHeader />} />;

export const Items = () => (
  <Sidebar>
    <SidebarItem icon={<ProfileIcon />} selected />
    <SidebarItem icon={<SatelliteIcon />} />
    <SidebarItem icon={<DataIcon />} />
  </Sidebar>
);

export const ItemsWithLabels = () => (
  <Sidebar>
    <SidebarItem icon={<ProfileIcon />} selected>
      Item one
    </SidebarItem>
    <SidebarItem icon={<SatelliteIcon />}>Item two</SidebarItem>
    <SidebarItem icon={<DataIcon />}>Item three</SidebarItem>
  </Sidebar>
);

export const ItemPosition = () => (
  <Sidebar>
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
  </Sidebar>
);

export const Footer = () => (
  <Sidebar footer={<Typography variant="h3">This is the footer</Typography>} />
);

export const KitchenSink = () => (
  <Sidebar
    logo={<OrbisAdminLogo style={{ height: '70px', color: '#fff' }} />}
    header={<AdminHeader />}
    footer={<Typography variant="h3">This is the footer</Typography>}
  >
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
  </Sidebar>
);
