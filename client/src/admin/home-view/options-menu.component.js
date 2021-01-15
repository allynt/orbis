import { IconButton, Menu, OptionsIcon } from '@astrosat/astrosat-ui';
import * as React from 'react';

export const OptionsMenu = ({ anchorEl, children, onButtonClick, onClose }) => {
  return (
    <>
      <IconButton
        aria-label="Options"
        aria-controls="options-menu"
        color={!!anchorEl ? 'primary' : 'default'}
        onClick={onButtonClick}
      >
        <OptionsIcon
          style={{ transform: 'rotate(90deg)' }}
          data-testid="options-icon"
        />
      </IconButton>
      <Menu
        id="options-menu"
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={onClose}
      >
        {children}
      </Menu>
    </>
  );
};
