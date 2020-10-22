import Wrapper from 'accounts/wrapper.component';
import React from 'react';
import CustomerRegistration from './customer-registration.component';

export default {
  title: 'Accounts/Customer Journey/CustomerRegistration',
  args: { email: 'test@test.com' },
  argTypes: { onSubmit: { action: 'onSubmit' } },
};

const Template = args => <CustomerRegistration {...args} />;

export const Form = Template.bind({});

export const Errors = Template.bind({});
Errors.args = { serverErrors: ['Problem'] };

export const IsLoading = Template.bind({});
IsLoading.args = {
  isLoading: true,
};

export const InWrapper = args => (
  <Wrapper>
    <CustomerRegistration {...args} />
  </Wrapper>
);
