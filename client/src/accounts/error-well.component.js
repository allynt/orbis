import React from 'react';
import { Box, Well } from '@astrosat/astrosat-ui';

/**
 * @param {{
 *   errors: string[]
 *   children?: React.ReactNode
 *  }} props
 */
export const ErrorWell = ({ errors, children }) =>
  errors || children ? (
    <Box width="100%">
      <Well severity="error">
        <ul data-testid="error-well">
          {errors?.map(error => (
            <li key={error}>{error}</li>
          ))}
          {children}
        </ul>
      </Well>
    </Box>
  ) : null;
