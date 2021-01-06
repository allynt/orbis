import React from 'react';

import { Button, TextField, Typography } from '@astrosat/astrosat-ui';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { Form } from 'components';
import { bookmarkTitle, CONTEXT_KEYS, FIELD_NAMES } from 'utils/validators';

const validationSchema = yup.object({
  [FIELD_NAMES.bookmarkTitle]: bookmarkTitle,
  [FIELD_NAMES.bookmarkDescription]: yup.string(),
});

/**
 * @param {{
 *   bookmarkTitles?: string[]
 *   onSubmit: (values: {title: string, description: string}) => void
 * }} props
 */
const BookmarkForm = ({ bookmarkTitles = [], onSubmit }) => {
  const { register, handleSubmit, errors, formState } = useForm({
    resolver: yupResolver(validationSchema),
    context: { [CONTEXT_KEYS.bookmarkTitles]: bookmarkTitles },
  });

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Form.Row>
        <Typography variant="h3" component="p">
          Create a New Map
        </Typography>
      </Form.Row>
      <Form.Row>
        <TextField
          id={FIELD_NAMES.bookmarkTitle}
          name={FIELD_NAMES.bookmarkTitle}
          inputRef={register}
          label="Title"
          error={!!errors[FIELD_NAMES.bookmarkTitle]}
          helperText={errors[FIELD_NAMES.bookmarkTitle]?.message}
          valid={
            !errors[FIELD_NAMES.bookmarkTitle] &&
            formState.touched[FIELD_NAMES.bookmarkTitle]
          }
          required
        />
      </Form.Row>
      <Form.Row>
        <TextField
          id={FIELD_NAMES.bookmarkDescription}
          name={FIELD_NAMES.bookmarkDescription}
          inputRef={register}
          label="Description"
          error={!!errors[FIELD_NAMES.bookmarkDescription]}
          helperText={errors[FIELD_NAMES.bookmarkDescription]?.message}
          valid={
            !errors[FIELD_NAMES.bookmarkDescription] &&
            formState.touched[FIELD_NAMES.bookmarkDescription]
          }
        />
      </Form.Row>
      <Form.Row centered>
        <Button
          type="submit"
          disabled={Object.keys(errors).length > 0 || !formState.isDirty}
        >
          Save New Map
        </Button>
      </Form.Row>
    </Form>
  );
};

export default BookmarkForm;
