import React from 'react';
import { ProfileIcon } from '@astrosat/astrosat-ui';
import { Sidebar, SidebarItem, SidebarTopItems, SidebarBottomItems } from './sidebar.component';
import { ReactComponent as OrbisLogo } from '../../orbis.svg';

const logoStyle = { height: '33px', color: '#fff' };

const AdminHeader = () => (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <ProfileIcon style={{ width: '3.125rem' }} />
    <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '8px' }}>
      <h2 style={{ fontSize: '1.25rem', whiteSpace: 'nowrap', marginTop: 0, marginBottom: '0.25rem' }}>Adam Raymond</h2>
      <h5 style={{ margin: 0, color: '#b9bed3' }}>Administrator</h5>
    </div>
  </div>
);

export default { title: 'Components/Sidebar', component: Sidebar };

export const NoItems = () => <Sidebar>Hello</Sidebar>;

export const WithLogo = () => <Sidebar logo={<OrbisLogo style={logoStyle} />} />;

export const Header = () => <Sidebar logo={<OrbisLogo style={logoStyle} />} header={<AdminHeader />} />;

export const Items = () => (
  <Sidebar logo={<OrbisLogo style={logoStyle} />}>
    <SidebarItem>Item one</SidebarItem>
    <SidebarItem>Item two</SidebarItem>
    <SidebarItem>Item three</SidebarItem>
  </Sidebar>
);

export const ItemsWithLabels = () => (
  <Sidebar logo={<OrbisLogo style={logoStyle} />}>
    <SidebarItem>Item one</SidebarItem>
    <SidebarItem>Item two</SidebarItem>
    <SidebarItem>Item three</SidebarItem>
  </Sidebar>
);

export const ItemPosition = () => (
  <Sidebar logo={<OrbisLogo style={logoStyle} />} header={<AdminHeader />}>
    <SidebarTopItems>
      <SidebarItem>Item one</SidebarItem>
      <SidebarItem>Item two</SidebarItem>
      <SidebarItem>Item three</SidebarItem>
    </SidebarTopItems>
    <SidebarBottomItems>
      <SidebarItem>Item four</SidebarItem>
      <SidebarItem>Item five</SidebarItem>
      <SidebarItem>Item six</SidebarItem>
    </SidebarBottomItems>
  </Sidebar>
);

export const Footer = () => (
  <Sidebar logo={<OrbisLogo style={logoStyle} />} header={<AdminHeader />} footer={<h3>This is the footer</h3>}>
    <SidebarItem>Item one</SidebarItem>
    <SidebarItem>Item two</SidebarItem>
    <SidebarItem>Item three</SidebarItem>
  </Sidebar>
);
