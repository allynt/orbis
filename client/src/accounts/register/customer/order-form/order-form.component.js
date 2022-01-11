import React from 'react';

import {
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Paper,
  styled,
  TextField,
  Typography,
} from '@astrosat/astrosat-ui';

import { format } from 'date-fns';
import { useForm } from 'react-hook-form';

import { ErrorWell } from 'accounts/error-well.component';
import { Form } from 'components';

import { DATE_FORMAT, TRIAL_PERIOD_END_DATE } from '../customer.constants';
import Order from './order.component';

const OrderWrapper = styled(Paper)(({ theme }) => ({
  maxHeight: '14ch',
  overflowX: 'auto',
  padding: '1.5em',
  fontSize: theme.typography.pxToRem(8),
}));

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
    subscription: 'ORBIS Core Datasets',
    amount: 0,
    licences: 10,
    period: TRIAL_PERIOD_END_DATE.toISOString(),
    confirm: true,
  });

  return (
    <Form onSubmit={handleSubmit(() => onSubmit(transformValues()))}>
      <Form.Row>
        <Typography align="center" variant="h2" component="h1" gutterBottom>
          Order Form
        </Typography>
      </Form.Row>
      <Form.Row>
        <Typography align="center" paragraph>
          Please confirm that the following form contains the information that
          you want to sign up for the final contract with ORBIS.
        </Typography>
      </Form.Row>
      <ErrorWell errors={serverErrors} />
      <Form.Row>
        <TextField
          {...register('subscription')}
          label="Selected Licence Subscription"
          id="subscription"
          name="subscription"
          InputProps={{ readOnly: true }}
        />
      </Form.Row>
      <Form.Row>
        <TextField
          {...register('paymentType')}
          label="Payment Type"
          id="paymentType"
          name="paymentType"
          InputProps={{ readOnly: true }}
        />
      </Form.Row>
      <Form.Row>
        <TextField
          {...register('amount')}
          label="Amount to be paid"
          id="amount"
          name="amount"
          InputProps={{ readOnly: true }}
        />
      </Form.Row>
      <Form.Row>
        <TextField
          {...register('licences')}
          label="Number of Licences"
          id="licences"
          name="licences"
          InputProps={{ readOnly: true }}
        />
      </Form.Row>
      <Form.Row>
        <TextField
          {...register('period')}
          label="Subscription Period Ends"
          id="period"
          name="period"
          InputProps={{ readOnly: true }}
        />
      </Form.Row>
      <Form.Row>
        <OrderWrapper>
          <Order />
        </OrderWrapper>
      </Form.Row>
      <Form.Row centered>
        <FormControlLabel
          label="I confirm the information above is correct"
          control={<Checkbox {...register('confirm')} name="confirm" />}
        />
      </Form.Row>
      <Form.Row centered>
        <Button type="submit" disabled={!watch('confirm')}>
          {isLoading ? (
            <CircularProgress color="inherit" size={24} />
          ) : (
            'Confirm'
          )}
        </Button>
      </Form.Row>
    </Form>
  );
};

export default OrderForm;
