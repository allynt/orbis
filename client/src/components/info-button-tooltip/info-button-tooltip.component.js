import React, { useState } from 'react';

import {
  ClickAwayListener,
  IconButton,
  InfoIcon,
  makeStyles,
  Tooltip,
} from '@astrosat/astrosat-ui';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
  infoButton: {
    fontSize: theme.typography.pxToRem(8),
    padding: theme.typography.pxToRem(2),
    height: 'min-content',
    width: 'min-content',
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

  return (
    <ClickAwayListener onClickAway={() => setIsInfoVisible(false)}>
      <Tooltip
        arrow
        placement={placement}
        disableHoverListener
        disableFocusListener
        disableTouchListener
        open={isInfoVisible}
        title={tooltipContent}
      >
        <IconButton
          color="inherit"
          className={clsx(iconButtonClassName, styles.infoButton)}
          aria-label="Info"
          onClick={() => setIsInfoVisible(c => !c)}
        >
          <InfoIcon fontSize="inherit" />
        </IconButton>
      </Tooltip>
    </ClickAwayListener>
  );
};
