import React from 'react';

import { OrbisLogo, Sidebar } from 'components';

export const ToolbarFallback = () => {
  return (
    <Sidebar
      style={{ top: '0', left: '0', zIndex: 4 }}
      logo={<OrbisLogo style={{ height: '3rem' }} />}
    />
  );
};
