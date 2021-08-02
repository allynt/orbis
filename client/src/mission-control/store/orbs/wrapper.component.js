import { Container, styled } from '@astrosat/astrosat-ui';

export const Wrapper = styled(Container)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  paddingTop: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    paddingBottom: theme.spacing(9),
  },
  [theme.breakpoints.up('lg')]: {
    paddingInline: theme.spacing(9),
  },
}));
