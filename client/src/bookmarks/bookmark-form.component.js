import React from 'react';

import { Button, Textfield } from '@astrosat/astrosat-ui';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import formStyles from '../forms.module.css';
import bookmarkStyles from '../side-menu/control-panel.module.css';
import { bookmarkTitle, CONTEXT_KEYS, FIELD_NAMES } from 'utils/validators';
import { FieldError } from 'components/field-error/field-error.component';

const validationSchema = yup.object({
  [FIELD_NAMES.bookmarkTitle]: bookmarkTitle,
  [FIELD_NAMES.bookmarkDescription]: yup.string(),
});

const BookmarkForm = ({ bookmarkTitles, submit }) => {
  const { register, handleSubmit, errors, formState } = useForm({
    resolver: yupResolver(validationSchema),
    context: { [CONTEXT_KEYS.bookmarkTitles]: bookmarkTitles },
  });

  const onSubmit = values => {
    submit(values);
  };

  return (
    <form
      className={`${formStyles.form} ${bookmarkStyles.form}`}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className={`${formStyles.fields} ${bookmarkStyles.fields}`}>
        <label
          className={formStyles.hiddenLabel}
          htmlFor={FIELD_NAMES.bookmarkTitle}
        >
          Title
        </label>
        <Textfield
          id={FIELD_NAMES.bookmarkTitle}
          name={FIELD_NAMES.bookmarkTitle}
          ref={register}
          placeholder="Title"
          autoFocus
        />
        {errors[FIELD_NAMES.bookmarkTitle] && (
          <FieldError message={errors[FIELD_NAMES.bookmarkTitle].message} />
        )}

        <label
          className={formStyles.hiddenLabel}
          htmlFor={FIELD_NAMES.bookmarkDescription}
        >
          Description
        </label>
        <Textfield
          id={FIELD_NAMES.bookmarkDescription}
          name={FIELD_NAMES.bookmarkDescription}
          ref={register}
          placeholder="Description"
        />
      </div>

      <Button
        type="submit"
        disabled={Object.keys(errors).length > 0 || !formState.isDirty}
      >
        Save Map
      </Button>
    </form>
  );
};

export default BookmarkForm;
