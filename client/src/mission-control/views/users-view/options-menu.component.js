import * as React from 'react';

import { IconButton, Menu, OptionsIcon } from '@astrosat/astrosat-ui';

export const OptionsMenu = ({ anchorEl, children, onButtonClick, onClose }) => {
  return (
    <>
      <IconButton
        aria-label="Options"
        aria-controls="options-menu"
        color={!!anchorEl ? 'primary' : 'default'}
        onClick={onButtonClick}
      >
        <OptionsIcon data-testid="options-icon" />
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
