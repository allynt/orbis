import { Button } from '@astrosat/astrosat-ui';
import * as React from 'react';

/**
 * @param {{
 *   results?: CrowdlessFeature[]
 *   onFindClick: () => void
 * }} props
 */
export const CrowdlessSidebarComponent = ({ results, onFindClick }) => (
  <>
    <Button onClick={onFindClick}>Find Supermarkets</Button>
    {results?.length &&
      results.map(result => (
        <>
          <p>{result.properties.name}</p>
          <p>{result.properties.address}</p>
        </>
      ))}
  </>
);
