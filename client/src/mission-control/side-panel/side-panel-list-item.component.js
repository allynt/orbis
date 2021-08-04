import React from 'react';

import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  makeStyles,
} from '@astrosat/astrosat-ui';

import { Link } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  root: {
    cursor: 'pointer',
    /** @param {{ isSelected: boolean} } props */
    color: props =>
      props.isSelected
        ? theme.palette.background.default
        : theme.palette.common.white,
    /** @param {{ isSelected: boolean} } props */
    backgroundColor: props =>
      props.isSelected
        ? theme.palette.primary.main
        : theme.palette.background.default,
  },
  icon: {
    /** @param {{ isSelected: boolean} } props */
    color: props =>
      props.isSelected
        ? theme.palette.background.default
        : theme.palette.common.white,
  },
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
  const styles = useStyles({ isSelected: selected });
  return (
    <ListItem component={Link} to={to} replace classes={styles}>
      <ListItemIcon aria-label={`${view} Icon`}>
        {Icon ? <Icon className={styles.icon} /> : null}
      </ListItemIcon>
      <ListItemText primary={<Typography variant="h2">{view}</Typography>} />
    </ListItem>
  );
};

export default SidePanelListItem;
