import React from 'react';

import { List } from '@astrosat/astrosat-ui';

import { useLocation } from 'react-router-dom';

import { VIEWS } from '../mission-control.constants';
import SidePanelListItem from './side-panel-list-item.component';

export const SidePanel = ({ userIsAdmin = false, className = '' }) => {
  const location = useLocation();

  return (
    <List
      className={className}
      component="nav"
      aria-label="mission control sidebar options"
      disablePadding
    >
      {Object.values(VIEWS)
        .filter(view => (userIsAdmin ? true : !view.admin))
        .map(({ label, route, Icon }) => (
          <SidePanelListItem
            key={label}
            view={label}
            Icon={Icon}
            to={`/mission-control${route}`}
            selected={location.pathname.includes(route)}
          />
        ))}
    </List>
  );
};
