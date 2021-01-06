import React from 'react';

import { useHistory } from 'react-router-dom';

import { Button, Textfield, Select } from '@astrosat/astrosat-ui';

import validate from '../bookmarks/bookmark-form/bookmark-form.validator';

import formStyles from '../forms.module.css';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { object, string } from 'yup';
import { bookmarkTitle, FIELD_NAMES } from 'utils/validators';

const validationSchema = object({
  [FIELD_NAMES.bookmarkTitle]: bookmarkTitle,
  [FIELD_NAMES.bookmarkDescription]: string(),
});

const NewMapForm = ({ regions, domains, bookmarkTitles }) => {
  const { register, handleSubmit, errors, watch, formState } = useForm();
  const history = useHistory();

  function onSubmit() {
    history.push('/map');
  }

  return (
    <form className={formStyles.form} onSubmit={handleSubmit(onSubmit)}>
      <div className={formStyles.fields}>
        <div className={formStyles.row}>
          <Textfield
            name={FIELD_NAMES.bookmarkTitle}
            ref={register}
            placeholder="Add Title*"
            autoFocus
          />
        </div>
        {errors.title && (
          <p className={formStyles.errorMessage}>{errors.title}</p>
        )}

        <div className={formStyles.row}>
          <Textfield
            name={FIELD_NAMES.bookmarkDescription}
            ref={register}
            placeholder="Add Description"
          />
        </div>
        {errors.description && (
          <p className={formStyles.errorMessage}>{errors.description}</p>
        )}
      </div>

      <div className={formStyles.row}>
        <Select name="region" ref={register} options={regions} />
        <Select
          name="domain"
          ref={register}
          options={domains.map(domain => ({ name: domain, value: domain }))}
          disabled={!watch('region')}
        />
      </div>

      <div className={formStyles.buttons}>
        <Button
          type="submit"
          theme="primary"
          disabled={Object.keys(errors).length > 0 || !formState.isDirty}
        >
          Create
        </Button>
      </div>
    </form>
  );
};

NewMapForm.propTypes = {};

export default NewMapForm;
