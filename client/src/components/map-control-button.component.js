import { Button, styled } from '@astrosat/astrosat-ui';

export const MapControlButton = styled(Button)(({ theme }) => ({
  padding: '0.5rem',
  zIndex: 10,
  backgroundColor: theme.palette.background.default,
  color: theme.palette.primary.main,
  fontSize: '0.74rem',
  minWidth: 'unset',
  '&:hover': {
    backgroundColor: theme.palette.background.default,
  },
}));
