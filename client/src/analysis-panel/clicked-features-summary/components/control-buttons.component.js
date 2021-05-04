import React from 'react';

import {
  Button as AuiButton,
  ButtonGroup,
  styled,
} from '@astrosat/astrosat-ui';

const Button = styled(AuiButton)(({ theme }) => ({
  padding: theme.spacing(1),
}));

/**
 * @param {{
 *  onDeselectAllClick: () => void
 *  onShowHideAllClick: () => void
 *  open?: boolean
 * }} props
 */
export const ControlButtons = ({
  onDeselectAllClick,
  onShowHideAllClick,
  open,
}) => (
  <ButtonGroup size="small" fullWidth>
    <Button fullWidth onClick={onDeselectAllClick}>
      Deselect All
    </Button>
    <Button fullWidth color="secondary" onClick={onShowHideAllClick}>
      {open ? 'Hide' : 'Show'} All
    </Button>
  </ButtonGroup>
);
