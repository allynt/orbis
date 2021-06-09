import React from 'react';

import Wrapper from 'accounts/wrapper.component';

import OrderForm from './order-form.component';
import OrderComponent from './order.component';

export default {
  title: 'Accounts/Customer Journey/OrderForm',
  argTypes: { onSubmit: { action: 'onSubmit' } },
};

const Template = args => <OrderForm {...args} />;

export const Form = Template.bind({});

export const Errors = Template.bind({});
Errors.args = {
  serverErrors: ['Problem'],
};

export const IsLoading = Template.bind({});
IsLoading.args = {
  isLoading: true,
};

export const InWrapper = args => (
  <Wrapper>
    <OrderForm {...args} />
  </Wrapper>
);

export const Order = () => <OrderComponent />;
