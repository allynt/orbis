import React from 'react';

import { List, makeStyles } from '@astrosat/astrosat-ui';

import { VIEWS } from '../constants';
import { ReactComponent as UsersIcon } from './side-panel-icons/users-icon.svg';
import SidePanelListItem from './side-panel-list-item.component';

const useStyles = makeStyles(theme => ({
  root: {
    width: theme.spacing(50),
  },
}));

/**
 * @param {{
 *  mainPanelView: string,
 *  setMainPanelView: (view: string) => void
 * }} props
 */
export const SidePanel = ({ mainPanelView, setMainPanelView }) => {
  const styles = useStyles({});

  const handleClick = view => {
    if (mainPanelView === view) return;
    return setMainPanelView(view);
  };

  const getIcon = view => {
    switch (view) {
      case VIEWS.users:
        return UsersIcon;
      default:
        return null;
    }
  };

  return (
    <List aria-label="mission control sidebar options" classes={styles}>
      {Object.values(VIEWS).map(view => (
        <SidePanelListItem
          key={view}
          view={view}
          mainPanelView={mainPanelView}
          onClick={handleClick}
          Icon={getIcon(view)}
        />
      ))}
    </List>
  );
};
