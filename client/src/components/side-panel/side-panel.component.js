import * as React from 'react';

import { makeStyles, useTheme, Slide } from '@astrosat/astrosat-ui';

import clsx from 'clsx';

const WIDTH = '22rem',
  BORDER_RADIUS = '1rem',
  WIDTH_NEGATIVE = `-${WIDTH}`,
  BORDER_RADIUS_NEGATIVE = `-${BORDER_RADIUS}`;

const useSlideStyles = ({ open, orientation }) => {
  const theme = useTheme();
  const orientationStyle = {
    [`margin${orientation === 'left' ? 'Right' : 'Left'}`]: open
      ? BORDER_RADIUS_NEGATIVE
      : WIDTH_NEGATIVE,
  };
  return {
    ...orientationStyle,
    zIndex: 3,
    transition: theme.transitions.create(['margin-left', 'margin-right'], {
      duration: theme.transitions.duration.enteringScreen,
      easing: theme.transitions.easing.easeInOut,
    }),
  };
};

const useStyles = makeStyles(theme => ({
  sidePanel: {
    width: WIDTH,
    height: '100%',
    backgroundColor: theme.palette.background.default,
    flexShrink: 0,
    zIndex: 3,
    boxShadow: theme.shadows[5],
  },
  header: {
    width: '100%',
    padding: theme.spacing(2),
    borderBottom: `2px solid ${theme.palette.primary.main}`,
  },
  left: {
    borderTopRightRadius: BORDER_RADIUS,
    borderBottomRightRadius: BORDER_RADIUS,
  },
  right: {
    borderTopLeftRadius: BORDER_RADIUS,
    borderBottomLeftRadius: BORDER_RADIUS,
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
  const styles = useStyles();
  const slideStyle = useSlideStyles({ open, orientation });
  return (
    <Slide
      style={slideStyle}
      direction={orientation === 'left' ? 'right' : 'left'}
      in={open}
    >
      <div className={clsx(className, styles.sidePanel, styles[orientation])}>
        {header && <div className={styles.header}>{header}</div>}
        <div className={contentClassName}>{children}</div>
      </div>
    </Slide>
  );
};
