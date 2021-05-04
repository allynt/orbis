import { styled } from '@astrosat/astrosat-ui';

export const LightText = styled('span')(({ theme }) => ({
  fontWeight: theme.typography.fontWeightLight,
}));
