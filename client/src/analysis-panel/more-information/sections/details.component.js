import React from 'react';
import { styled, Typography } from '@astrosat/astrosat-ui';

const StyledTypography = styled(Typography)({ gridColumn: '1 / -1' });

/**
 * @param {{
 *   details: import('typings/orbis').Property['details']
 * }} props
 */
export const Details = ({ details }) => (
  <StyledTypography>{details}</StyledTypography>
);
