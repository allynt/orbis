import React from 'react';
import UserRegistrationSuccess from './user-registration-success.component';

export default {
  title: 'Accounts/Customer Journey/UserRegistrationSuccess',
  argTypes: { onResend: { action: 'onResend' } },
};

export const WithEmail = args => <UserRegistrationSuccess {...args} />;
WithEmail.args = {
  email: 'test@test.com',
};

export const WithoutEmail = args => <UserRegistrationSuccess {...args} />;
