import Wrapper from 'accounts/wrapper.component';
import React from 'react';
import OrderForm from './order-form.component';
import OrderComponent from './order.component';

export default {
  title: 'Accounts/Customer Journey/OrderForm',
  argTypes: { onSubmit: { action: 'onSubmit' } },
};

export const Form = args => <OrderForm {...args} />;

export const InWrapper = args => (
  <Wrapper>
    <OrderForm {...args} />
  </Wrapper>
);

export const Order = () => <OrderComponent />;
