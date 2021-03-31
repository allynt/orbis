import { styled, Typography } from '@astrosat/astrosat-ui';

export const SectionLabel = styled(Typography)(({ theme }) => ({
  ...theme.typography.h4,
  lineHeight: 'normal',
}));

export const SectionValue = styled(Typography)({
  wordBreak: 'break-word',
  gridColumn: '2 / -1',
});
