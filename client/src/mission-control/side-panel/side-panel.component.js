import React from 'react';

import { List } from '@astrosat/astrosat-ui';

import { useLocation, useRouteMatch } from 'react-router-dom';

import { VIEWS } from '../mission-control.constants';
import SidePanelListItem from './side-panel-list-item.component';

export const SidePanel = ({ userIsAdmin }) => {
  const { pathname } = useLocation();
  const { path } = useRouteMatch();

  return (
    <List component="nav" aria-label="mission control sidebar options">
      {Object.values(VIEWS)
        .filter(view => (userIsAdmin ? true : !view.admin))
        .map(({ label, route, Icon }) => (
          <SidePanelListItem
            key={label}
            view={label}
            Icon={Icon}
            to={`${path}${route}`}
            selected={pathname.includes(route)}
          />
        ))}
    </List>
  );
};
