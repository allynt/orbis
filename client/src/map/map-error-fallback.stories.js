import React from 'react';

import faker from 'faker';

import { MapErrorFallback } from './map-error-fallback.component';

export default {
  title: 'Map/MapErrorFallback',
  component: MapErrorFallback,
  argTypes: { resetErrorBoundary: { action: true } },
};

const Template = args => (
  // <div style={{ width: '100%', height: '100vh' }}>
  <MapErrorFallback {...args} />
  // </div>
);

export const Default = Template.bind({});
Default.args = {
  error: new Error(faker.lorem.paragraphs(20)),
};
