import { styled } from '@astrosat/astrosat-ui';

export const Header = styled('div')(({ theme }) => ({
  ...theme.typography.h2,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(3),
  borderBottom: `1px solid ${theme.palette.grey[400]}`,
}));
