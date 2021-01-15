import React from 'react';

import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  styled,
} from '@astrosat/astrosat-ui';

const BigAvatar = styled(Avatar)(({ theme }) => ({
  width: '3rem',
  height: '3rem',
  backgroundColor: theme?.palette?.text.primary,
}));

/**
 * @param {{
 *  avatar?: string
 *  name?:string
 * }} props
 */
export const UserProfile = ({ avatar, name }) => (
  <ListItem>
    <ListItemAvatar>
      <BigAvatar alt="User Avatar" src={avatar} />
    </ListItemAvatar>
    <ListItemText
      primary={
        <Typography variant="h2">{!name ? 'Administrator' : name}</Typography>
      }
      secondary={!!name && 'Administrator'}
    />
  </ListItem>
);
