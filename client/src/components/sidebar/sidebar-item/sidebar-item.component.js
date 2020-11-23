import {
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Tooltip,
} from '@astrosat/astrosat-ui';
import React from 'react';

import { SidebarItemInner } from './sidebar-item-inner.component';

import styles from './sidebar-item.module.css';

const useStyles = makeStyles(theme => ({
  root: {
    borderRadius: `${theme.typography.pxToRem(
      theme.shape.borderRadius,
    )} 0 0 ${theme.typography.pxToRem(theme.shape.borderRadius)}`,
    '&$selected': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.text.secondary,
    },
  },
  selected: {},
}));

const iconStyles = makeStyles({
  root: {
    color: 'inherit',
  },
});

export const SidebarItem = ({ children, icon, selected, tooltip, onClick }) => {
  const classes = useStyles();
  const iconClasses = iconStyles();

  return (
    <>
      <Tooltip arrow title={tooltip}>
        <ListItem classes={classes} button selected={selected}>
          {icon && <ListItemIcon classes={iconClasses}>{icon}</ListItemIcon>}
          {children && <ListItemText>{children}</ListItemText>}
        </ListItem>
      </Tooltip>
      <li
        tabIndex="1"
        className={`${styles.sidebarItem} ${children && styles.withLabel} ${
          selected && styles.selected
        }`}
        onClick={onClick}
        onKeyUp={e =>
          (e.keyCode === 32 || e.keyCode === 13) && onClick && onClick(e)
        }
        data-tip
        data-for={`toolbar-item-${tooltip}-tooltip`}
      >
        <SidebarItemInner children={children} icon={icon} tooltip={tooltip} />
      </li>
    </>
  );
};
