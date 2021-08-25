import * as React from 'react';

import { IconButton, Menu, OptionsIcon } from '@astrosat/astrosat-ui';

const DefaultButton = ({ active, ...rest }) => (
  <IconButton
    aria-label="Options"
    color={active ? 'primary' : 'default'}
    {...rest}
  >
    <OptionsIcon data-testid="options-icon" />
  </IconButton>
);

export const OptionsMenu = ({
  children,
  closeOnClick = true,
  Button = DefaultButton,
  id = 'options-menu',
  transformOrigin = {
    vertical: -35,
    horizontal: 'right',
  },
  ...rest
}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  /**
   * @param {React.MouseEvent<HTMLButtonElement, MouseEvent>} e
   */
  const handleButtonClick = e => setAnchorEl(e.currentTarget);

  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <Button
        aria-controls={id}
        active={!!anchorEl}
        onClick={handleButtonClick}
      />
      <Menu
        id={id}
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={handleClose}
        // @ts-ignore
        transformOrigin={transformOrigin}
        {...rest}
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
