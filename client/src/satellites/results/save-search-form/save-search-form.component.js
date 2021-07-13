import React from 'react';

import { Button, TextField, Typography } from '@astrosat/astrosat-ui';

import { useForm } from 'react-hook-form';

/**
 * @param {{
 *  onSubmit: (name: string) => void
 * }} props
 */
const SaveSearchForm = ({ onSubmit: onSubmitProp }) => {
  const { register, errors, handleSubmit, formState } = useForm();

  function onSubmit(values) {
    onSubmitProp(values.name);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Typography>
        Please name your search. Find your saved searches alongside your saved
        AOIs under "Saved Searches"
      </Typography>
      <TextField
        inputRef={register({
          minLength: {
            value: 3,
            message: 'Name field must exceed 3 characters',
          },
        })}
        name="name"
        label="Name"
        required
        autoFocus
        error={!!errors.name}
        helperText={errors.name?.message}
      />
      <Button type="submit" disabled={!formState.isDirty || !!errors.name}>
        Save Search
      </Button>
    </form>
  );
};

export default SaveSearchForm;
