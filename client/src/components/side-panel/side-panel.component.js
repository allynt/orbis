import clsx from 'clsx';
import * as React from 'react';

import { makeStyles } from '@astrosat/astrosat-ui';

const useStyles = makeStyles(theme => ({
  header: {
    width: '100%',
    padding: theme.spacing(2),
    borderBottom: `2px solid ${theme.palette.primary.main}`,
  },
  content: {
    padding: theme.spacing(1),
  },
  open: {
    transform: 'translateX(0)',
    '&$left': {
      marginRight: 'calc(-1 * 20rem)',
    },
    '&$right': {
      marginLeft: 'calc(-1 * 20rem)',
    },
  },
  left: {
    borderTopRightRadius: '1rem',
    borderBottomRightRadius: '1rem',
    transform: 'translateX(0)',
    marginRight: 'calc(-1 * 20rem)',
  },
  right: {
    borderTopLeftRadius: '1rem',
    borderBottomLeftRadius: '1rem',
    transform: 'translateX(20rem)',
    marginLeft: 'calc(-1 * 20rem)',
  },
  sidePanel: {
    width: '20rem',
    height: '100%',
    backgroundColor: theme.palette.secondary.main,
    color: '#ffffff',
    flexShrink: 0,
    transition: 'transform 250ms ease-in-out, margin 300ms ease-in-out',
    zIndex: 3,
  },
}));
/**
 * @param {{
 *  children?: React.ReactNode
 *  className?: string
 *  contentClassName?: string
 *  header?: React.ReactNode
 *  open?: boolean
 *  orientation?: 'left' | 'right'
 * }} props
 */
export const SidePanel = ({
  children,
  className,
  contentClassName,
  header,
  open = false,
  orientation = 'left',
}) => {
  const style = useStyles({});
  return (
    <div
      className={clsx(className, style.sidePanel, style[orientation], {
        [style.open]: open,
      })}
    >
      {header && <div className={style.header}>{header}</div>}
      <div className={clsx(style.content, contentClassName)}>{children}</div>
    </div>
  );
};
