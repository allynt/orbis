import React, { useState } from 'react';

import { useHistory } from 'react-router-dom';

import { ReactComponent as OrbisLogo } from '../orbis.svg';
import { Sidebar, SidebarItem, SidebarBottomItems } from 'components/sidebar';

import styles from './toolbar.module.css';

const Toolbar = ({ items }) => {
  const [selected, setSelected] = useState();
  const history = useHistory();

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
      logo={
        <OrbisLogo
          title="Orbis Logo"
          className={styles.logo}
          onClick={() => history.push('/')}
        />
      }
    >
      {items?.filter(item => !item.footer).map(makeSidebarItem)}
      <SidebarBottomItems>
        {items?.filter(item => item.footer).map(makeSidebarItem)}
      </SidebarBottomItems>
    </Sidebar>
  );
};

export default Toolbar;
