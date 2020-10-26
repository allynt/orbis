import Wrapper from 'accounts/wrapper.component';
import React from 'react';
import JourneySelection from './journey-selection.component';

export default { title: 'Accounts/Journey Selection' };

export const BothRegistrationsOpen = () => <JourneySelection />;

export const IndividualRegistrationClosed = () => (
  <JourneySelection individualRegistrationIsOpen={false} />
);

export const CustomerRegistrationClosed = () => (
  <JourneySelection customerRegistrationIsOpen={false} />
);

export const InWrapper = () => (
  <Wrapper>
    <JourneySelection />
  </Wrapper>
);
