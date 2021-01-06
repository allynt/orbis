import { styled, List as AuiList } from '@astrosat/astrosat-ui';

export const List = styled(AuiList)(({ theme }) => ({
  padding: `${theme.typography.pxToRem(
    theme.spacing(3),
  )} ${theme.typography.pxToRem(theme.spacing(4))}`,
  overflowY: 'auto',
  height: '100%',
}));
