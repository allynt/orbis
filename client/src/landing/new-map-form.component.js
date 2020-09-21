import React from 'react';

import { useHistory } from 'react-router-dom';

import { Button, Textfield, Select, useForm } from '@astrosat/astrosat-ui';

import validate from '../bookmarks/bookmark-form.validator';

import formStyles from '../forms.module.css';

const NewMapForm = ({ regions, domains, bookmarkTitles }) => {
  const { handleChange, handleSubmit, values, errors } = useForm(
    onSubmit,
    validate(bookmarkTitles),
  );
  const history = useHistory();

  function onSubmit() {
    history.push('/map');
  }

  return (
    <form className={formStyles.form} onSubmit={handleSubmit}>
      <div className={formStyles.fields}>
        <div className={formStyles.row}>
          <Textfield
            name="title"
            value={values.title || ''}
            placeholder="Add Title*"
            onChange={handleChange}
            required
            autoFocus
          />
        </div>
        {errors.title && (
          <p className={formStyles.errorMessage}>{errors.title}</p>
        )}

        <div className={formStyles.row}>
          <Textfield
            name="description"
            value={values.description || ''}
            placeholder="Add Description"
            onChange={handleChange}
          />
        </div>
        {errors.description && (
          <p className={formStyles.errorMessage}>{errors.description}</p>
        )}
      </div>

      <div className={formStyles.row}>
        <Select
          name="region"
          value={values.region || ''}
          options={regions}
          onChange={handleChange}
        />
        <Select
          name="domain"
          value={values.domain || ''}
          options={domains.map(domain => ({ name: domain, value: domain }))}
          onChange={handleChange}
          disabled={values.region ? false : true}
        />
      </div>

      <div className={formStyles.buttons}>
        <Button
          type="submit"
          theme="primary"
          disabled={
            Object.keys(errors).length > 0 || Object.keys(values).length === 0
          }
        >
          Create
        </Button>
      </div>
    </form>
  );
};

NewMapForm.propTypes = {};

export default NewMapForm;
