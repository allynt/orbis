import { TextField } from '@astrosat/astrosat-ui';
import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import { useForm } from 'react-hook-form';
import { date } from 'utils/validators';
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
    resolver: yupResolver(schema),
  });

  const onSubmit = v => {
    onSubmitProp(
      Object.entries(v).reduce((acc, [key, value]) => {
        if (!value) return acc;
        const [d, m, y] = value.split(/\/|-/);
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
        id="startDate"
        name="startDate"
        label="Start Date"
        inputRef={register}
        error={!!errors.startDate}
        helperText={errors.startDate?.message}
      />
      <TextField
        id="endDate"
        name="endDate"
        label="End Date"
        inputRef={register}
        error={!!errors.endDate}
        helperText={errors.endDate?.message}
      />
    </form>
  );
};
