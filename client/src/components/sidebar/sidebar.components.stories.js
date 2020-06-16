import React from 'react';
import { Sidebar, SidebarItem, SidebarTopItems, SidebarBottomItems } from './sidebar.component';
import { ReactComponent as OrbisLogo } from '../../orbis.svg';

const logoStyle = { height: '33px', color: '#fff' };

export default { title: 'Components/Sidebar', component: Sidebar };

export const NoItems = () => <Sidebar>Hello</Sidebar>;

export const WithLogo = () => <Sidebar logo={<OrbisLogo style={logoStyle} />} />;

export const WithHeader = () => <Sidebar logo={<OrbisLogo style={logoStyle} />} header={<h3>This is a sidebar</h3>} />;

export const WithItems = () => (
  <Sidebar logo={<OrbisLogo style={logoStyle} />} header={<h3>This is a sidebar</h3>}>
    <SidebarItem>Item one</SidebarItem>
    <SidebarItem>Item two</SidebarItem>
    <SidebarItem>Item three</SidebarItem>
  </Sidebar>
);

export const ItemPosition = () => (
  <Sidebar logo={<OrbisLogo />} header={<h1>This is a sidebar</h1>}>
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

export const WithFooter = () => (
  <Sidebar logo={<OrbisLogo />} header={<h1>This is a sidebar</h1>} footer={<h3>This is the footer</h3>}>
    <SidebarItem>Item one</SidebarItem>
    <SidebarItem>Item two</SidebarItem>
    <SidebarItem>Item three</SidebarItem>
  </Sidebar>
);
