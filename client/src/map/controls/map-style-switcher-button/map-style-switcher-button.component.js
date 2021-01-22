import * as React from 'react';
import { Button, LayersIcon, styled } from '@astrosat/astrosat-ui';

const StyledButton = styled(Button)(({ theme }) => ({
  position: 'absolute',
  padding: '0.5rem',
  bottom: '8rem',
  right: '2rem',
  zIndex: 10,
  backgroundColor: theme.palette.background.default,
  color: theme.palette.primary.main,
  fontSize: '0.875rem',
  minWidth: 'unset',
  '&:hover': {
    backgroundColor: theme.palette.background.default,
  },
}));

export const MapStyleSwitcherButton = ({ onClick }) => (
  <StyledButton onClick={onClick}>
    <LayersIcon fontSize="inherit" />
  </StyledButton>
);
