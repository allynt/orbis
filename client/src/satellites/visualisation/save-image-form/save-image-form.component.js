import React from 'react';

import { Button, TextField } from '@astrosat/astrosat-ui';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

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
    <form onSubmit={handleSubmit(v => onSubmit(v))}>
      <TextField
        id="name"
        name="name"
        label="Add Name"
        required
        inputRef={register}
        error={!!errors.name}
        helperText={errors.name?.message}
      />
      <TextField
        id="description"
        name="description"
        label="Add Description"
        multiline
        inputRef={register}
      />
      <Button type="submit" color="secondary">
        Save
      </Button>
    </form>
  );
};
