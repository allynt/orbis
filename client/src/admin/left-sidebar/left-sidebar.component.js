import React from 'react';

import { HomeIcon, LaunchIcon, AwardIcon, styled } from '@astrosat/astrosat-ui';

import { Sidebar, SidebarItem } from 'components/sidebar';

import { ADMIN_VIEW } from '../admin.constants';
import { ReactComponent as OrbisAdminLogo } from '../orbis-admin-logo.svg';
import { UserProfile } from './user-profile/user-profile.component';

const Logo = styled(OrbisAdminLogo)(({ theme }) => ({
  height: theme.typography.pxToRem(70),
  color: theme.palette.text.primary,
  cursor: 'pointer',
}));

/**
 * @param {{
 *   user?: import('typings/orbis').User
 *   setVisiblePanel?: (panel: string) => void
 *   visiblePanel?: string
 * }} props
 */
const LeftSidebar = ({ user, setVisiblePanel, visiblePanel }) => (
  <Sidebar
    logo={
      <Logo
        title="Orbis Admin Logo"
        onClick={() => setVisiblePanel(ADMIN_VIEW.home)}
      />
    }
    header={<UserProfile {...user} />}
  >
    <SidebarItem
      icon={<HomeIcon />}
      onClick={() => setVisiblePanel(ADMIN_VIEW.home)}
      selected={visiblePanel === ADMIN_VIEW.home}
    >
      Home
    </SidebarItem>
    <SidebarItem
      icon={<AwardIcon />}
      onClick={() => setVisiblePanel(ADMIN_VIEW.licenceDashboard)}
      selected={visiblePanel === ADMIN_VIEW.licenceDashboard}
    >
      Licences
    </SidebarItem>
    <SidebarItem
      href="/"
      rel="noopener noreferrer"
      target="_blank"
      icon={<LaunchIcon />}
    >
      Launch Orbis
    </SidebarItem>
  </Sidebar>
);

export default LeftSidebar;
