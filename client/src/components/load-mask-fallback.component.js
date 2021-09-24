import React from 'react';

import { Fade, LoadMask } from '@astrosat/astrosat-ui';

export const LoadMaskFallback = ({ zIndex = 1 }) => (
  <Fade in>
    <div>
      <LoadMask style={{ zIndex }} open />
    </div>
  </Fade>
);
