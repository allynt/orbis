import React from 'react';

import { makeStyles } from '@astrosat/astrosat-ui';

import { useHistory } from 'react-router-dom';

import { Sidebar, SidebarItem, SidebarBottomItems } from 'components/sidebar';

import { ReactComponent as OrbisLogo } from '../orbis-light.svg';

const useLogoStyles = makeStyles({
  logo: {
    height: '3rem',
    color: '#ffffff',
    cursor: 'pointer',
  },
});

const Logo = React.memo(function Logo() {
  const styles = useLogoStyles();
  const history = useHistory();
  return (
    <OrbisLogo
      title="Orbis Logo"
      className={styles.logo}
      onClick={() => history.push('/')}
    />
  );
});

const useStyles = makeStyles({
  toolbar: {
    top: '0',
    left: '0',
    zIndex: 4,
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
  const styles = useStyles();

  /**
   * @param {import('./toolbar-config').ToolbarItem} item
   */
  const makeSidebarItem = item => (
    <SidebarItem
      key={item.label}
      icon={item.icon}
      onClick={item.action}
      tooltip={item.label}
      selected={openItem === item.label}
      href={item.href}
      target="_blank"
      rel="noreferrer noopener"
    />
  );

  return (
    <Sidebar className={styles.toolbar} logo={<Logo />}>
      {items?.filter(item => !item.footer).map(makeSidebarItem)}
      <SidebarBottomItems>
        {items?.filter(item => item.footer).map(makeSidebarItem)}
      </SidebarBottomItems>
    </Sidebar>
  );
};

export default Toolbar;
