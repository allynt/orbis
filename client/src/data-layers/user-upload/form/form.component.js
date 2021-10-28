import React from 'react';

import { Button, styled, TextField } from '@astrosat/astrosat-ui';

import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';

import validate from '../validate/validate';
import { Dropzone } from './dropzone.component';

const FormWrapper = styled('form')(({ theme }) => ({
  display: 'grid',
  gridAutoFlow: 'row',
  rowGap: theme.spacing(2),
}));

const schema = yup.object({
  name: yup.string().required('Please enter a name'),
  description: yup.string(),
  file: yup.mixed().test({
    async test(value) {
      const result = await validate(value);
      if (typeof result === 'string')
        return this.createError({ message: result });
      return true;
    },
  }),
});

export const Form = () => {
  const { register, handleSubmit, control, errors, setValue } = useForm({
    defaultValues: { file: null, name: '', description: '' },
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const handleFileClear = () => {
    setValue('file', null, { shouldValidate: false, shouldDirty: false });
  };

  return (
    <FormWrapper noValidate onSubmit={handleSubmit(console.log)}>
      <Controller
        name="file"
        control={control}
        render={props => (
          <Dropzone error={errors.file} onClear={handleFileClear} {...props} />
        )}
      />
      <TextField
        id="name"
        name="name"
        label="Name Your Data"
        required
        inputRef={register}
        error={!!errors.name}
        helperText={errors.name?.message}
      />
      <TextField
        id="description"
        name="description"
        label="Add a Description for Your Data"
        inputRef={register}
      />
      <Button type="submit">Upload</Button>
    </FormWrapper>
  );
};
