import React from 'react';

import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  makeStyles,
} from '@astrosat/astrosat-ui';

const useStyles = makeStyles(theme => ({
  root: {
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
 *  mainPanelView: string,
 *  onClick: (view: string) => void
 *  Icon: React.ComponentType<any>
 * }} props
 */
const SidePanelListItem = ({ view, mainPanelView, onClick, Icon }) => {
  const isSelected = mainPanelView === view;
  const styles = useStyles({ isSelected });
  return (
    <ListItem onClick={() => onClick(view)} classes={styles}>
      <ListItemIcon aria-label={`${view} Icon`}>
        {Icon ? <Icon className={styles.icon} /> : null}
      </ListItemIcon>
      <ListItemText primary={<Typography variant="h2">{view}</Typography>} />
    </ListItem>
  );
};

export default SidePanelListItem;
