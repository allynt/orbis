import React from 'react';
import { styled, Typography } from '@astrosat/astrosat-ui';
import { isArray } from 'lodash';

const StyledTypography = styled(Typography)({ gridColumn: '1 / -1' });

/**
 * @param {{
 *   details: import('typings/orbis').Property['details']
 * }} props
 */
export const Details = ({ details }) => {
  if (isArray(details)) {
    return (
      <>
        {details.map(line => (
          <StyledTypography key={`details-line-${line.split(' ')[0]}`}>
            {line}
          </StyledTypography>
        ))}
      </>
    );
  }

  return <StyledTypography>{details}</StyledTypography>;
};
