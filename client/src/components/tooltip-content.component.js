import React from 'react';

import { Typography, styled } from '@astrosat/astrosat-ui';

const CategoryPath = styled(Typography)({ fontStyle: 'italic' });
const Description = styled(Typography)(({ theme }) => ({
  fontWeight: theme.typography.fontWeightBold,
}));

/**
 * @param {{
 *  categoryPath?: string
 *  description: string
 * }} props
 */
export const TooltipContent = ({ categoryPath, description }) => (
  <>
    {categoryPath && <CategoryPath paragraph>{categoryPath}</CategoryPath>}
    <Description>{description}</Description>
  </>
);
