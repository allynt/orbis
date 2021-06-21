import React from 'react';

import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@astrosat/astrosat-ui';

import { VIEWS } from '../constants';

export const SidePanel = ({ mainPanelView, setMainPanelView }) => {
  const handleClick = view => {
    if (mainPanelView === view) return;
    return setMainPanelView(view);
  };

  return (
    <List aria-label="mission control sidebar options">
      {Object.values(VIEWS).map(view => (
        <ListItem key={view} onClick={() => handleClick(view)}>
          <ListItemIcon aria-label={`${view} Icon`}></ListItemIcon>
          <ListItemText
            primary={<Typography component="h2">{view}</Typography>}
          />
        </ListItem>
      ))}
    </List>
  );
};
