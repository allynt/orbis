import React from 'react';

import { MapErrorFallback } from './map-error-fallback.component';

export default {
  title: 'Map/MapErrorFallback',
  component: MapErrorFallback,
  args: { messageOnly: false },
  argTypes: { resetErrorBoundary: { action: true } },
};

const Template = args => (
  // <div style={{ width: '100%', height: '100vh' }}>
  <MapErrorFallback {...args} />
  // </div>
);

export const Default = Template.bind({});
Default.args = {
  error: new Error('Something broke'),
};
