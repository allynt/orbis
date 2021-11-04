import React from 'react';

import { makeStyles } from '@astrosat/astrosat-ui';

import { Sidebar, SidebarItem, SidebarBottomItems } from 'components/sidebar';

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
    <Sidebar className={styles.toolbar}>
      {items?.filter(item => !item.footer).map(makeSidebarItem)}
      <SidebarBottomItems>
        {items?.filter(item => item.footer).map(makeSidebarItem)}
      </SidebarBottomItems>
    </Sidebar>
  );
};

export default Toolbar;
