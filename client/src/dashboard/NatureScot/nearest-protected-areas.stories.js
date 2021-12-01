import React, { useMemo } from 'react';

import { useSortBy } from 'react-table';

import * as data from '../mock-data/NatureScot/mock-nearest-protected-areas';
import { NearestProtectedAreas } from './nearest-protected-areas';
export default {
  title: 'Dashboard/NatureScot/NearestProtectedAreas',
  args: { data: data },
};

const Template = args => {
  return <NearestProtectedAreas {...args} />;
};

export const Default = Template.bind({});
