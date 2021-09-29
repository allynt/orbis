import React from 'react';

import { ErrorFallback } from './map-error-fallback.component';

export default {
  title: 'Map/ErrorFallback',
  component: ErrorFallback,
  args: { messageOnly: false },
  argTypes: { resetErrorBoundary: { action: true } },
};

const Template = args => (
  // <div style={{ width: '100%', height: '100vh' }}>
  <ErrorFallback {...args} />
  // </div>
);

export const Default = Template.bind({});
Default.args = {
  error: new Error('Something broke'),
};
