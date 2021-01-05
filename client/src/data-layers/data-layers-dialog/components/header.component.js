import { styled } from '@astrosat/astrosat-ui';

export const Header = styled('div')(({ theme }) => ({
  ...theme.typography.h2,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.grey[500]}`,
}));
