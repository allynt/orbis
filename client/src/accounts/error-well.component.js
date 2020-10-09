import React from 'react';
import { Well } from '@astrosat/astrosat-ui';

/**
 * @param {{
 *   errors: string[]
 *   children?: React.ReactNode
 *  }} props
 */
export const ErrorWell = ({ errors, children }) =>
  errors || children ? (
    <Well type="error">
      <ul data-testid="error-well">
        {errors?.map(error => (
          <li key={error}>{error}</li>
        ))}
        {children}
      </ul>
    </Well>
  ) : null;
