import React from 'react';

import { makeStyles } from '@astrosat/astrosat-ui';

import { useHistory } from 'react-router-dom';

import { Sidebar, SidebarItem, SidebarBottomItems } from 'components/sidebar';

import { ReactComponent as OrbisLogo } from '../orbis-light.svg';

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

/**
 * @param {{
 *  items: import('./toolbar-config').ToolbarItem[]
 *  openItem?: string
 * }} props
 */
const Toolbar = ({ items, openItem }) => {
  const history = useHistory();
  const styles = useStyles({});

  /**
   * @param {import('./toolbar-config').ToolbarItem} item
   */
  const select = item => {
    item.action();
  };

  /**
   * @param {import('./toolbar-config').ToolbarItem} item
   */
  const makeSidebarItem = item => (
    <SidebarItem
      key={item.label}
      icon={item.icon}
      onClick={() => item.action && select(item)}
      tooltip={item.label}
      selected={openItem === item.label}
      href={item.href}
      target="_blank"
      rel="noreferrer noopener"
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
