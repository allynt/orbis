import { styled, List as AuiList } from '@astrosat/astrosat-ui';

export const List = styled(AuiList)(({ theme }) => ({
  padding: theme.spacing(4),
  overflowY: 'auto',
  height: '100%',
}));
