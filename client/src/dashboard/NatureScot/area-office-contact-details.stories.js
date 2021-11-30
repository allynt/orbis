import React, { useMemo } from 'react';

import * as data from '../mock-data/NatureScot/mock-area-office-contact';
import AreaOfficeContactDetails from './area-office-contact-details.component';

export default {
  title: 'DashBoard/NatureScot/AreaOfficeContactDetails',
  args: { data: data },
};

const Template = args => {
  return <AreaOfficeContactDetails {...args} />;
};

export const Default = Template.bind({});
