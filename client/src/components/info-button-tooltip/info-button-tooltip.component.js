import React, { useState } from 'react';

import {
  ClickAwayListener,
  IconButton,
  InfoIcon,
  makeStyles,
  Tooltip,
  Typography,
} from '@astrosat/astrosat-ui';

import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
  infoButton: {
    fontSize: theme.typography.pxToRem(8),
    padding: theme.typography.pxToRem(2),
    height: 'min-content',
    width: 'min-content',
    backgroundColor: theme.palette.text.primary,
    color: theme.palette.background.default,
    '&:hover, &:active, &:focus': {
      backgroundColor: theme.palette.primary.main,
    },
  },
  content: {
    fontWeight: 600,
  },
}));

/**
 * @param {{
 *   placement?: "left" | "bottom-end" | "bottom-start" | "bottom" | "left-end" | "left-start" | "right-end" | "right-start" | "right" | "top-end" | "top-start" | "top"
 *   tooltipContent: React.ReactNode
 *   iconButtonClassName?: string
 * }} props
 */
export const InfoButtonTooltip = ({
  tooltipContent,
  placement = 'left',
  iconButtonClassName,
}) => {
  const [isInfoVisible, setIsInfoVisible] = useState(false);
  const styles = useStyles();

  /**
   * @param {React.MouseEvent<HTMLButtonElement, MouseEvent>} e
   */
  const handleIconClick = e => {
    e.stopPropagation();
    setIsInfoVisible(c => !c);
  };

  return (
    <ClickAwayListener onClickAway={() => setIsInfoVisible(false)}>
      <Tooltip
        arrow
        placement={placement}
        disableHoverListener
        disableFocusListener
        disableTouchListener
        open={isInfoVisible}
        title={
          typeof tooltipContent === 'string' ? (
            <Typography className={styles.content}>{tooltipContent}</Typography>
          ) : (
            tooltipContent
          )
        }
      >
        <IconButton
          color="inherit"
          className={clsx(styles.infoButton, iconButtonClassName)}
          aria-label="Info"
          onClick={handleIconClick}
        >
          <InfoIcon titleAccess="Info" fontSize="inherit" />
        </IconButton>
      </Tooltip>
    </ClickAwayListener>
  );
};
