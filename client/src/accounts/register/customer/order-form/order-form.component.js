import { Button, Checkbox } from '@astrosat/astrosat-ui';
import { Field } from 'components/field/field.component';
import { format } from 'date-fns';
import React from 'react';
import { useForm } from 'react-hook-form';
import { TRIAL_PERIOD_END_DATE } from '../customer.constants';

/**
 * @typedef {{
 *   subscription: string
 *   paymentType: string
 *   amount: number
 *   licences: number
 *   period: string
 *   confirm: boolean
 * }} FormValues
 */

/**
 * @param {{onSubmit: (values: FormValues) => void}} props
 */
const OrderForm = ({ onSubmit }) => {
  const { handleSubmit, register, watch } = useForm({
    defaultValues: {
      paymentType: 'Free Trial',
      subscription: 'ORBIS Core',
      amount: '£0',
      licences: 10,
      period: format(TRIAL_PERIOD_END_DATE, 'do MMMM yyyy'),
      confirm: false,
    },
  });

  /**
   * @returns {FormValues}
   */
  const transformValues = () => ({
    paymentType: 'free',
    subscription: 'core',
    amount: 0,
    licences: 10,
    period: TRIAL_PERIOD_END_DATE.toISOString(),
    confirm: true,
  });

  return (
    <form onSubmit={handleSubmit(() => onSubmit(transformValues()))}>
      <Field
        register={register}
        label="Selected Licence Subscription"
        name="subscription"
        readOnly
      />
      <Field
        register={register}
        label="Payment Type"
        name="paymentType"
        readOnly
      />
      <Field
        register={register}
        label="Amount to be paid"
        name="amount"
        readOnly
      />
      <Field
        register={register}
        label="Number of Licences"
        name="licences"
        readOnly
      />
      <Field
        register={register}
        label="Subscription Period Ends"
        name="period"
        readOnly
      />
      <Checkbox
        ref={register}
        name="confirm"
        label="I confirm the information above is correct"
      />
      <Button type="submit" disabled={!watch('confirm')}>
        Confirm
      </Button>
    </form>
  );
};

export default OrderForm;
