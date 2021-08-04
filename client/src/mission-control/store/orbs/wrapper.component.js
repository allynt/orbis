import { Container, styled } from '@astrosat/astrosat-ui';

export const Wrapper = styled(Container)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  paddingBlock: theme.spacing(2),
  paddingInline: `min(5vw, ${theme.spacing(9)})`,
  [theme.breakpoints.up('sm')]: {
    paddingBottom: theme.spacing(9),
  },
}));
