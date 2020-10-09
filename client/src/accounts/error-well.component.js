import React from 'react';
import { Well } from '@astrosat/astrosat-ui';

/**
 * @param {{ errors: string[] }} props
 */
export const ErrorWell = ({ errors }) =>
  errors ? (
    <Well type="error">
      <ul data-testid="error-well">
        {errors.map(error => (
          <li key={error}>{error}</li>
        ))}
      </ul>
    </Well>
  ) : null;
