import clsx from 'clsx';
import * as React from 'react';

import { makeStyles } from '@astrosat/astrosat-ui';

import { Slide } from '@astrosat/astrosat-ui/src/proxies';

const useStyles = makeStyles(theme => ({
  sidePanel: {
    width: '20rem',
    height: '100%',
    backgroundColor: theme.palette.background.default,
    flexShrink: 0,
    zIndex: 3,
  },
  header: {
    width: '100%',
    padding: theme.spacing(2),
    borderBottom: `2px solid ${theme.palette.primary.main}`,
  },
  left: {
    borderTopRightRadius: '1rem',
    borderBottomRightRadius: '1rem',
    marginRight: '-1rem',
  },
  right: {
    borderTopLeftRadius: '1rem',
    borderBottomLeftRadius: '1rem',
    marginLeft: '-1rem',
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
    <Slide direction={orientation === 'left' ? 'right' : 'left'} in={open}>
      <div className={clsx(className, style.sidePanel, style[orientation])}>
        {header && <div className={style.header}>{header}</div>}
        <div className={contentClassName}>{children}</div>
      </div>
    </Slide>
  );
};
