import { TextField } from '@astrosat/astrosat-ui';
import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

const dateSeparator = /\/-\./;

const dateSchema = yup.lazy(v =>
  !v
    ? yup.string()
    : yup
        .string()
        .matches(/^\d{1,2}(\/|-)\d{1,2}(\/|-)(\d{2}){1,2}$/)
        .test({
          name: 'Valid date',
          message: 'Please enter a valid date',
          test: value => {
            let [d, m, y] = value.split(/\/|-/).map(Number);
            m = m - 1; // Months are 0 indexed
            const date = new Date(y, m, d);
            if (
              date.getUTCFullYear() === y &&
              date.getUTCMonth() === m &&
              date.getUTCDate() === d
            ) {
              return true;
            } else return false;
          },
        }),
);
const schema = yup.object({
  startDate: dateSchema,
  endDate: dateSchema,
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
