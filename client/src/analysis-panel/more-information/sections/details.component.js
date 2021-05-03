import React from 'react';
import { styled, Typography } from '@astrosat/astrosat-ui';
import { isArray } from 'lodash';
import { v4 as uuid } from 'uuid';

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
        {details.map((line, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <StyledTypography key={`details-line-${i}`}>{line}</StyledTypography>
        ))}
      </>
    );
  }

  return <StyledTypography>{details}</StyledTypography>;
};
