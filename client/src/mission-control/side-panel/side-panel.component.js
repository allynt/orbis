import React from 'react';

import { List, makeStyles } from '@astrosat/astrosat-ui';

import { useRouteMatch } from 'react-router-dom';

import { VIEWS } from '../mission-control.constants';
import SidePanelListItem from './side-panel-list-item.component';

const useStyles = makeStyles(theme => ({
  root: {
    width: theme.spacing(50),
    padding: '0',
  },
}));

export const SidePanel = () => {
  const styles = useStyles({});
  const { path } = useRouteMatch();

  return (
    <List
      component="nav"
      aria-label="mission control sidebar options"
      classes={styles}
    >
      {Object.values(VIEWS).map(({ label, route, Icon }) => (
        <SidePanelListItem
          key={label}
          view={label}
          Icon={Icon}
          to={`${path}${route}`}
        />
      ))}
    </List>
  );
};
