import React from 'react';

import {
  alpha,
  Grid,
  makeStyles,
  Slider,
  Slide,
  Tooltip,
  Typography,
} from '@astrosat/astrosat-ui';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

const MIN = 1,
  MAX = 100,
  MARKS = [
    { value: 20, label: '20' },
    { value: 40, label: '40' },
    { value: 60, label: '60' },
    { value: 80, label: '80' },
  ];

const useStyles = makeStyles(theme => ({
  input: {
    ...theme.typography.body1,
    padding: theme.spacing(0.5, 1),
    maxWidth: '6ch',
    border: 'none',
    borderRadius: theme.shape.borderRadius,
    color: theme.palette.text.primary,
    backgroundColor: props =>
      alpha(
        props.lightMapStyle
          ? theme.palette.background.default
          : theme.palette.background.paper,
        0.5,
      ),
    textAlign: 'center',
  },
  markLabel: {
    color: props =>
      alpha(
        props.lightMapStyle
          ? theme.palette.secondary.main
          : theme.palette.text.primary,
        0.7,
      ),
  },
  markLabelActive: {
    color: props =>
      props.lightMapStyle
        ? theme.palette.secondary.main
        : theme.palette.text.primary,
  },
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
 * @typedef {{
 *   value?: number
 *   onChange: (value: number) => void
 *   mapStyle: import('map-style/styles').MapStyleKey
 *   open?: boolean
 * }} ExtrusionScaleSliderProps
 */

// BUG: [ORB-799] Hitting enter while extrusion scale slider input is focussed refreshes page
export const ExtrusionScaleSlider = React.memo(
  /** @param {ExtrusionScaleSliderProps} props */
  ({ value, onChange, mapStyle, open = false }) => {
    const lightMapStyle = mapStyle === 'light' || mapStyle === 'streets';
    const styles = useStyles({ lightMapStyle });
    const {
      register,
      handleSubmit,
      formState: { errors },
      setValue,
    } = useForm({
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
      onChange && onChange(value);
    };

    return (
      <Slide in={open} direction="up" mountOnEnter>
        <Grid
          component="form"
          container
          spacing={2}
          onChange={handleSubmit(v => onChange(v.text))}
        >
          <Grid item>
            <Typography color={lightMapStyle ? 'secondary' : 'textPrimary'}>
              3D Scale :{' '}
            </Typography>
          </Grid>
          <Grid item xs>
            <Slider
              classes={{
                markLabel: styles.markLabel,
                markLabelActive: styles.markLabelActive,
              }}
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
              title={errors.text?.message ?? ''}
            >
              <input
                className={styles.input}
                name="text"
                {...register('text')}
              />
            </Tooltip>
          </Grid>
        </Grid>
      </Slide>
    );
  },
);
ExtrusionScaleSlider.displayName = 'ExtrusionScaleSlider';
