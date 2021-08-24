import * as React from 'react';

import { IconButton, Menu, OptionsIcon } from '@astrosat/astrosat-ui';

export const OptionsMenu = ({ children, closeOnClick = true }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  /**
   * @param {React.MouseEvent<HTMLButtonElement, MouseEvent>} e
   */
  const handleButtonClick = e => setAnchorEl(e.currentTarget);

  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <IconButton
        aria-label="Options"
        aria-controls="options-menu"
        color={!!anchorEl ? 'primary' : 'default'}
        onClick={handleButtonClick}
      >
        <OptionsIcon data-testid="options-icon" />
      </IconButton>
      <Menu
        id="options-menu"
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={handleClose}
        transformOrigin={{
          vertical: -35,
          horizontal: 'right',
        }}
      >
        {React.Children.map(children, child => {
          return child
            ? React.cloneElement(child, {
                onClick: (...args) => {
                  if (closeOnClick) handleClose();
                  child.props.onClick && child.props.onClick(...args);
                },
              })
            : child;
        })}
      </Menu>
    </>
  );
};
