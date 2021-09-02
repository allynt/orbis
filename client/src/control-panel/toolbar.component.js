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
  const makeSidebarItem = ({ id, order, footer, ...rest }) => (
    <SidebarItem
      key={id}
      selected={openItem === id}
      target="_blank"
      rel="noreferrer noopener"
      {...rest}
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
