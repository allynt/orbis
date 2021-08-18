import React from 'react';

import Wrapper from 'accounts/wrapper.component';

import JourneySelection from './journey-selection.component';

export default { title: 'Accounts/Journey Selection' };

const Template = args => <JourneySelection {...args} />;

export const Default = Template.bind({});
Default.args = {
  individualRegistrationIsOpen: true,
  customerRegistrationIsOpen: true,
};

export const InWrapper = args => (
  <Wrapper>
    <Default {...args} />
  </Wrapper>
);
InWrapper.args = Default.args;
