import React from 'react';

import { ReactComponent as OrbisAdminLogo } from '../orbis-admin-logo.svg';
import { ReactComponent as HomeIcon } from './home.svg';
import { ReactComponent as LaunchOrbisIcon } from './launch-orbis.svg';

import { USER_TABLE } from '../admin.component';
import styles from './left-sidebar.module.css';
import { UserProfile } from './user-profile/user-profile.component';
import { Sidebar, SidebarItem, SidebarLinkItem } from 'components/sidebar';

const LeftSidebar = ({ user, setVisiblePanel }) => (
  <Sidebar
    logo={<OrbisAdminLogo title="Orbis Admin Logo" className={styles.logo} />}
    header={<UserProfile {...user} />}
  >
    <SidebarItem icon={<HomeIcon className={styles.buttonIcon} onClick={() => setVisiblePanel(USER_TABLE)} />}>
      Home
    </SidebarItem>
    <SidebarLinkItem
      href="/"
      rel="noopener noreferrer"
      target="_blank"
      icon={<LaunchOrbisIcon className={styles.buttonIcon} />}
    >
      Launch Orbis
    </SidebarLinkItem>
  </Sidebar>
);

export default LeftSidebar;
