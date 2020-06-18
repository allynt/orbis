import React from 'react';

import { Sidebar, SidebarItem, SidebarLinkItem } from 'components/sidebar';

import { ReactComponent as HomeIcon } from './home.svg';
import { ReactComponent as LaunchOrbisIcon } from './launch-orbis.svg';
import { ReactComponent as OrbisAdminLogo } from '../orbis-admin-logo.svg';

import { UserProfile } from './user-profile/user-profile.component';
import { USER_TABLE } from '../admin.component';

import styles from './left-sidebar.module.css';

const LeftSidebar = ({ user, setVisiblePanel, visiblePanel }) => (
  <Sidebar
    logo={
      <OrbisAdminLogo title="Orbis Admin Logo" className={styles.logo} onClick={() => setVisiblePanel(USER_TABLE)} />
    }
    header={<UserProfile {...user} />}
  >
    <SidebarItem
      icon={<HomeIcon className={styles.itemIcon} />}
      onClick={() => setVisiblePanel(USER_TABLE)}
      selected={visiblePanel === USER_TABLE}
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
