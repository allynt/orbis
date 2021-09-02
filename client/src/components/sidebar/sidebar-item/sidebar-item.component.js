import React from 'react';

import {
  fade,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Tooltip,
} from '@astrosat/astrosat-ui';

const useStyles = makeStyles(theme => ({
  root: {
    justifyContent: 'center',
    borderRadius: `${theme.typography.pxToRem(
      theme.shape.borderRadius,
    )} 0 0 ${theme.typography.pxToRem(theme.shape.borderRadius)}`,
    '&:hover': {
      backgroundColor: fade(theme.palette.grey[400], 0.3),
    },
    '&$selected': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.secondary.main,
      '&:hover': {
        backgroundColor: fade(theme.palette.grey[400], 0.3),
      },
    },
  },
  selected: {},
}));

const iconStyles = makeStyles(theme => ({
  root: {
    color: 'inherit',
    minWidth: 24,
    marginRight: theme.spacing(2),
  },
}));

/**
 * @param {{
 *  children?: React.ReactNode
 *  icon?: JSX.Element
 *  selected?: boolean
 *  tooltip?: string
 *  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
 *  href?: string
 * } & Partial<Omit<HTMLAnchorElement, 'children'>>} props
 */
const Component = ({
  children,
  icon,
  selected,
  tooltip,
  href,
  onClick,
  ...rest
}) => {
  const classes = useStyles();
  const iconClasses = iconStyles();

  const Content = (
    <ListItem
      classes={classes}
      button
      component={href ? 'a' : undefined}
      selected={selected}
      onClick={onClick}
      href={href}
      {...rest}
    >
      {icon && (
        <ListItemIcon classes={iconClasses}>
          {React.cloneElement(icon, { fontSize: 'large' })}
        </ListItemIcon>
      )}
      {children && <ListItemText>{children}</ListItemText>}
    </ListItem>
  );

  return tooltip ? (
    <Tooltip arrow title={tooltip}>
      {Content}
    </Tooltip>
  ) : (
    Content
  );
};
export const SidebarItem = React.memo(Component);
