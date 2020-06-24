import React from 'react';

import { Sidebar, SidebarItem, SidebarLinkItem } from 'components/sidebar';

import { ReactComponent as HomeIcon } from './home.svg';
import { ReactComponent as LaunchOrbisIcon } from './launch-orbis.svg';
import { ReactComponent as OrbisAdminLogo } from '../orbis-admin-logo.svg';

import { UserProfile } from './user-profile/user-profile.component';
import { ADMIN_VIEW } from '../admin.constants';

import styles from './left-sidebar.module.css';

const LeftSidebar = ({ user, setVisiblePanel, visiblePanel }) => (
  <Sidebar
    logo={
      <OrbisAdminLogo
        title="Orbis Admin Logo"
        className={styles.logo}
        onClick={() => setVisiblePanel(ADMIN_VIEW.home)}
      />
    }
    header={<UserProfile {...user} />}
  >
    <SidebarItem
      icon={<HomeIcon className={styles.itemIcon} />}
      onClick={() => setVisiblePanel(ADMIN_VIEW.home)}
      selected={visiblePanel === ADMIN_VIEW.home}
    >
      Home
    </SidebarItem>
    <SidebarLinkItem
      href="/"
      rel="noopener noreferrer"
      target="_blank"
      icon={<LaunchOrbisIcon className={styles.itemIcon} />}
    >
      Launch Orbis
    </SidebarLinkItem>
  </Sidebar>
);

export default LeftSidebar;
