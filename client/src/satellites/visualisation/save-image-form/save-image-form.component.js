import React from 'react';

import {
  Button,
  Grid,
  TextField,
  Typography,
  styled,
} from '@astrosat/astrosat-ui';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

const SavedToText = styled(Typography)(({ theme }) => ({
  ...theme.typography.caption,
  fontWeight: 600,
  marginTop: theme.spacing(1),
}));

const validationSchema = yup.object({
  name: yup.string().required('Name is required'),
  description: yup.string(),
});

/**
 * @typedef FormValues
 * @property {string} name
 * @property {string} [description]
 */

/**
 * @param {{
 *  onSubmit: (values: FormValues) => void
 * }} props
 */
export const SaveImageForm = ({ onSubmit }) => {
  /** @type {import('react-hook-form').UseFormMethods<FormValues>} */
  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(validationSchema),
  });

  return (
    <Grid
      component="form"
      noValidate
      container
      spacing={2}
      direction="column"
      onSubmit={handleSubmit(v => onSubmit(v))}
    >
      <Grid item>
        <TextField
          id="name"
          name="name"
          label="Add Name"
          required
          inputRef={register}
          error={!!errors.name}
          helperText={errors.name?.message}
          autoFocus
        />
      </Grid>
      <Grid item>
        <TextField
          id="description"
          name="description"
          label="Add Description"
          multiline
          rows={3}
          inputRef={register}
        />
      </Grid>
      <Grid item container direction="column" alignItems="center">
        <Button type="submit" color="secondary">
          Save
        </Button>
        <SavedToText>Saved To: My Data / Satellite Images</SavedToText>
      </Grid>
    </Grid>
  );
};
