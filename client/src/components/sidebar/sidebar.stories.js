import React from 'react';

import { ProfileIcon, SatelliteIcon, DataIcon } from '@astrosat/astrosat-ui';

import { Sidebar, SidebarItem, SidebarBottomItems } from '.';

import { ReactComponent as OrbisLogo } from '../../orbis-light.svg';
import { ReactComponent as OrbisAdminLogo } from '../../admin/orbis-admin-logo.svg';

const logoStyle = { height: '33px', color: '#fff' };

const AdminHeader = () => (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <ProfileIcon style={{ width: '3.125rem' }} />
    <div
      style={{ display: 'flex', flexDirection: 'column', marginLeft: '8px' }}
    >
      <h2
        style={{
          fontSize: '1.25rem',
          whiteSpace: 'nowrap',
          marginTop: 0,
          marginBottom: '0.25rem',
        }}
      >
        Adam Raymond
      </h2>
      <h5 style={{ margin: 0, color: '#b9bed3' }}>Administrator</h5>
    </div>
  </div>
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

export const Footer = () => <Sidebar footer={<h3>This is the footer</h3>} />;

export const KitchenSink = () => (
  <Sidebar
    logo={<OrbisAdminLogo style={{ height: '70px', color: '#fff' }} />}
    header={<AdminHeader />}
    footer={<h3>This is the footer</h3>}
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
