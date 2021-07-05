import React from 'react';

import { Button, TextField, useForm, Typography } from '@astrosat/astrosat-ui';

import validate from './save-search-form.validator';

const SaveSearchForm = ({ query, close, saveSearch }) => {
  const { handleChange, handleSubmit, values, errors } = useForm(
    onSubmit,
    validate,
  );

  function onSubmit() {
    saveSearch({ ...values, ...query });
    close();
  }

  return (
    <form onSubmit={handleSubmit}>
      <Typography>
        Please name your search. Find your saved searches alongside your saved
        AOIs under "Saved Searches"
      </Typography>
      <TextField
        name="name"
        value={values.name || ''}
        label="Name"
        onChange={handleChange}
        required
        autoFocus
        error={!!errors.name}
        helperText={errors.name}
      />
      <Button
        type="submit"
        disabled={
          Object.keys(errors).length > 0 || Object.keys(values).length === 0
        }
      >
        Save Search
      </Button>
    </form>
  );
};

export default SaveSearchForm;
