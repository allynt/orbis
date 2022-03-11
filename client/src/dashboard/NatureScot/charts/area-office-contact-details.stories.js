import React from 'react';

import * as data from '../mock-data/NatureScot/mock-area-office-contact';
import AreaOfficeContactDetails from './area-office-contact-details.component';

export default {
  title: 'DashBoard/Nature Scotland/AreaOfficeContactDetails',
  args: { contactDetails: data[0] },
};

const Template = args => {
  return <AreaOfficeContactDetails {...args} />;
};

export const Default = Template.bind({});
