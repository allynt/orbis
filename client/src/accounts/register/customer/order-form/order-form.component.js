import React from 'react';

import { Button, Checkbox } from '@astrosat/astrosat-ui';

import { format } from 'date-fns';
import { useForm } from 'react-hook-form';

import { ErrorWell } from 'accounts/error-well.component';
import { Field } from 'components/field/field.component';
import { LoadingSpinner } from 'components/loading-spinner/loading-spinner.component';
import { DATE_FORMAT, TRIAL_PERIOD_END_DATE } from '../customer.constants';
import Order from './order.component';

import formStyles from 'forms.module.css';
import styles from './order-form.module.css';

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
 * @param {{
 *   serverErrors?: string[]
 *   isLoading?: boolean
 *   onSubmit: (values: FormValues) => void
 * }} props
 */
const OrderForm = ({ serverErrors, isLoading, onSubmit }) => {
  const { handleSubmit, register, watch } = useForm({
    defaultValues: {
      paymentType: 'Free Trial',
      subscription: 'ORBIS Core',
      amount: '£0',
      licences: 10,
      period: format(TRIAL_PERIOD_END_DATE, DATE_FORMAT),
      confirm: false,
    },
  });

  /**
   * @returns {FormValues}
   */
  const transformValues = () => ({
    paymentType: 'Free Trial',
    subscription: 'core',
    amount: 0,
    licences: 10,
    period: TRIAL_PERIOD_END_DATE.toISOString(),
    confirm: true,
  });

  return (
    <form onSubmit={handleSubmit(() => onSubmit(transformValues()))}>
      <h1 className={styles.heading}>Order Form</h1>
      <p className={styles.paragraph}>
        Please confirm that the following form contains the information that you
        want to sign up for the final contract with ORBIS.
      </p>
      <ErrorWell errors={serverErrors} />
      <Field
        register={register}
        label="Selected Licence Subscription"
        name="subscription"
        readOnly
        inline
      />
      <Field
        register={register}
        label="Payment Type"
        name="paymentType"
        readOnly
        inline
      />
      <Field
        register={register}
        label="Amount to be paid"
        name="amount"
        readOnly
        inline
      />
      <Field
        register={register}
        label="Number of Licences"
        name="licences"
        readOnly
        inline
      />
      <Field
        register={register}
        label="Subscription Period Ends"
        name="period"
        readOnly
        inline
      />
      <div className={styles.order}>
        <Order />
      </div>
      <Checkbox
        className={`${formStyles.row} ${styles.centered}`}
        ref={register}
        name="confirm"
        label="I confirm the information above is correct"
      />
      <Button
        className={styles.centered}
        type="submit"
        disabled={!watch('confirm')}
      >
        {isLoading ? <LoadingSpinner /> : 'Confirm'}
      </Button>
    </form>
  );
};

export default OrderForm;
