import { TextField } from '@astrosat/astrosat-ui';
import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toDMY } from 'utils/dates';
import { date, FIELD_NAMES } from 'utils/validators';
import * as yup from 'yup';

const schema = yup.object({
  startDate: date,
  endDate: date,
});
/**
 * @param {{
 *  onSubmit: (values: {startDate?: string, endDate?: string}) => void
 *  minDate?: string
 *  maxDate?: string
 * }} props
 */
export const DateRangeFilter = ({
  onSubmit: onSubmitProp,
  minDate,
  maxDate,
}) => {
  const { register, handleSubmit, errors } = useForm({
    mode: 'onChange',
    context: { minDate, maxDate },
    resolver: yupResolver(schema),
  });

  const onSubmit = v => {
    onSubmitProp(
      Object.entries(v).reduce((acc, [key, value]) => {
        if (!value) return acc;
        const [d, m, y] = toDMY(value);
        return {
          ...acc,
          [key]: new Date(y, m, d).toISOString(),
        };
      }, {}),
    );
  };

  return (
    <form onChange={handleSubmit(onSubmit)}>
      <TextField
        id={FIELD_NAMES.startDate}
        name={FIELD_NAMES.startDate}
        label="Start Date"
        placeholder="DD/MM/YYYY"
        inputRef={register}
        error={!!errors.startDate}
        helperText={errors.startDate?.message}
      />
      <TextField
        id={FIELD_NAMES.endDate}
        name={FIELD_NAMES.endDate}
        label="End Date"
        placeholder="DD/MM/YYYY"
        inputRef={register}
        error={!!errors.endDate}
        helperText={errors.endDate?.message}
      />
    </form>
  );
};
