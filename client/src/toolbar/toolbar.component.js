import React, { useState, useEffect } from 'react';

import { useHistory } from 'react-router-dom';

import { ReactComponent as OrbisLogo } from '../orbis.svg';
import { Sidebar, SidebarItem, SidebarBottomItems } from 'components/sidebar';

import styles from './toolbar.module.css';

const Toolbar = ({ user, items }) => {
  const [selected, setSelected] = useState();
  const [permissionFilteredItems, setPermissionFilteredItems] = useState();
  const history = useHistory();

  useEffect(() => {
    setPermissionFilteredItems(items.filter(item => user.roles.some(role => item.roles.includes(role))));
  }, [user, items]);

  const select = item => {
    setSelected(item);
    item.action();
  };

  const makeSidebarItem = item => (
    <SidebarItem
      key={item.label}
      icon={item.icon}
      onClick={() => select(item)}
      tooltip={item.label}
      selected={selected?.label === item.label}
    />
  );

  return (
    <Sidebar
      className={styles.toolbar}
      logo={<OrbisLogo title="Orbis Logo" className={styles.logo} onClick={() => history.push('/')} />}
    >
      {permissionFilteredItems?.filter(item => !item.footer).map(makeSidebarItem)}
      <SidebarBottomItems>
        {permissionFilteredItems?.filter(item => item.footer).map(makeSidebarItem)}
      </SidebarBottomItems>
    </Sidebar>
  );
};

export default Toolbar;
