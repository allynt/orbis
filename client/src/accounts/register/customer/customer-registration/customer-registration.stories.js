import React from 'react';
import CustomerRegistration from './customer-registration.component';

export default {
  title: 'Accounts/Customer Journey/CustomerRegistration',
  args: { email: 'test@test.com' },
  argTypes: { onSubmit: { action: 'onSubmit' } },
};

export const Form = args => <CustomerRegistration {...args} />;
