import * as React from 'react';

import {
  fade,
  Grid,
  Slider,
  styled,
  Tooltip,
  Typography,
} from '@astrosat/astrosat-ui';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

const MIN = 1,
  MAX = 100,
  MARKS = [
    { value: 10, label: '10' },
    { value: 20, label: '20' },
    { value: 40, label: '40' },
    { value: 60, label: '60' },
    { value: 80, label: '80' },
    { value: 100, label: '100' },
  ];

const Input = styled('input')(({ theme }) => ({
  ...theme.typography.body1,
  padding: theme.spacing(0.5, 1),
  maxWidth: '6ch',
  border: 'none',
  borderRadius: theme.shape.borderRadius,
  color: theme.palette.text.primary,
  backgroundColor: fade(theme.palette.background.paper, 0.3),
  textAlign: 'center',
}));

const schema = yup.object({
  text: yup
    .number()
    .transform((value, originalValue) =>
      String(originalValue).trim() === '' ? null : value,
    )
    .typeError('Please enter a number')
    .notRequired()
    .positive()
    .integer()
    .max(MAX, `Value must be less than or equal to ${MAX}`)
    .min(MIN, `Value must be greater than or equal to ${MIN}`),
});

/**
 * @param {{
 *   value?: number
 *   onChange: (value: number) => void
 * }} props
 */

/** @type {React.ForwardRefExoticComponent<{value?: number, onChange: (value: number) => void}>} */
export const ExtrusionScaleSlider = React.forwardRef(
  ({ value, onChange }, ref) => {
    const { register, handleSubmit, errors, setValue } = useForm({
      mode: 'all',
      defaultValues: {
        text: value,
      },
      resolver: yupResolver(schema),
    });

    /** @type {(event: React.ChangeEvent<{}>, value: number | number[]) => void} */
    const handleSliderChange = (_, v) => {
      const value = /** @type {number} */ (v);
      setValue('text', value, { shouldValidate: true });
      onChange(value);
    };

    return (
      <Grid
        component="form"
        ref={ref}
        container
        spacing={2}
        onChange={handleSubmit(v => onChange(v.text))}
      >
        <Grid item>
          <Typography>3D Scale : </Typography>
        </Grid>
        <Grid item xs>
          <Slider
            marks={MARKS}
            min={MIN}
            value={value}
            onChange={handleSliderChange}
            step={1}
          />
        </Grid>
        <Grid item>
          <Tooltip
            arrow
            placement="right"
            open={!!errors.text}
            title={errors.text?.message}
          >
            <Input name="text" ref={register} />
          </Tooltip>
        </Grid>
      </Grid>
    );
  },
);
