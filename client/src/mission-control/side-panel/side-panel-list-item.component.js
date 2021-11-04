import React from 'react';

import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  makeStyles,
  alpha,
} from '@astrosat/astrosat-ui';

import { Link } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  root: {
    color: theme.palette.text.primary,
    '&$selected': {
      color: theme.palette.background.default,
      backgroundColor: theme.palette.primary.main,
      '&:hover': {
        backgroundColor: alpha(theme.palette.grey[400], 0.3),
      },
    },
    cursor: 'pointer',
  },
  icon: { color: 'inherit' },
  selected: {},
}));

/**
 * @param {{
 *  view: string,
 *  Icon: React.ComponentType<any>
 *  to: string
 *  selected?: boolean
 * }} props
 */
const SidePanelListItem = ({ view, Icon, to, selected }) => {
  const { icon, ...listItemClasses } = useStyles();
  return (
    <ListItem
      role="link"
      component={Link}
      to={location => ({ ...location, pathname: to })}
      replace
      classes={listItemClasses}
      selected={selected}
      button
    >
      <ListItemIcon classes={{ root: icon }} aria-label={`${view} Icon`}>
        {Icon ? <Icon /> : null}
      </ListItemIcon>
      <ListItemText primary={<Typography variant="h2">{view}</Typography>} />
    </ListItem>
  );
};

export default SidePanelListItem;
