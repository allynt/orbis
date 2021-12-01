import React from 'react';

import * as data from '../mock-data/NatureScot/mock-nearest-protected-areas';
import { NearestProtectedAreas } from './nearest-protected-areas';
export default {
  title: 'Dashboard/Nature Scotland/NearestProtectedAreas',
  args: { data: data },
};

const Template = args => {
  return <NearestProtectedAreas {...args} />;
};

export const Default = Template.bind({});
