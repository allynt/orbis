import { styled } from '@astrosat/astrosat-ui';

export const Heading = styled('h1')(({ theme }) => ({
  ...theme.typography.h1,
  fontWeight: 600,
  fontSize: '2rem',
  width: 'fit-content',
  margin: theme.spacing(0, 'auto', 5),
  borderBottom: `1px solid ${theme.palette.primary.main}`,
}));
