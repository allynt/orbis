import React, { useState } from 'react';

import { useHistory } from 'react-router-dom';

import { ReactComponent as OrbisLogo } from '../orbis.svg';
import { Sidebar, SidebarItem, SidebarBottomItems } from 'components/sidebar';

import styles from './toolbar.module.css';

const Toolbar = ({ user, items }) => {
  const [selected, setSelected] = useState(null);
  const history = useHistory();

  const select = item => {
    setSelected(item);
    item.action();
  };

  return (
    <Sidebar
      className={styles.toolbar}
      logo={
        <OrbisLogo style={{ height: '33px', color: '#fff', cursor: 'pointer' }} onClick={() => history.push('/')} />
      }
    >
      {items
        .filter(item => !item.footer)
        .filter(item => user.roles.some(role => item.roles.includes(role)))
        .map(item => (
          <SidebarItem
            key={item.label}
            icon={item.icon}
            onClick={() => select(item)}
            tooltip={item.label}
            selected={selected && selected.label === item.label}
          />
        ))}
      <SidebarBottomItems>
        {items
          .filter(item => item.footer)
          .filter(item => user.roles.some(role => item.roles.includes(role)))
          .map(item => (
            <SidebarItem
              key={item.label}
              icon={item.icon}
              onClick={() => select(item)}
              tooltip={item.label}
              selected={selected && selected.label === item.label}
            />
          ))}
      </SidebarBottomItems>
    </Sidebar>
  );
};

export default Toolbar;
