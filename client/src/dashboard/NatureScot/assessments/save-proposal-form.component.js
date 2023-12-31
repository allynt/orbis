import React from 'react';

import { Button, Grid, TextField } from '@astrosat/astrosat-ui';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

const validationSchema = yup.object({
  name: yup.string().required('Name is required'),
  description: yup.string().required('Description is required'),
});

const SaveProposalForm = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { name: '', description: '' },
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
          {...register('name')}
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
          required
          rows={3}
          error={!!errors.description}
          helperText={errors.description?.message}
          {...register('description')}
        />
      </Grid>
      <Grid item container direction="column" alignItems="center">
        <Button
          type="submit"
          color="secondary"
          data-testid="proposal-save-button"
        >
          Save
        </Button>
      </Grid>
    </Grid>
  );
};

export default SaveProposalForm;
