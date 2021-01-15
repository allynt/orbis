import React, { useState } from 'react';

import { useHistory } from 'react-router-dom';

import { ReactComponent as OrbisLogo } from '../orbis-light.svg';
import { Sidebar, SidebarItem, SidebarBottomItems } from 'components/sidebar';

import { makeStyles } from '@astrosat/astrosat-ui';

const useStyles = makeStyles({
  toolbar: {
    top: '0',
    left: '0',
    zIndex: 4,
  },
  logo: {
    height: '3rem',
    color: '#ffffff',
    cursor: 'pointer',
  },
  icon: {
    width: '100%',
  },
});

const Toolbar = ({ items }) => {
  const [selected, setSelected] = useState();
  const history = useHistory();
  const styles = useStyles({});

  const select = item => {
    setSelected(item);
    item.action(history);
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
