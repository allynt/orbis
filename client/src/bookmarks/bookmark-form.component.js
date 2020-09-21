import React from 'react';
import PropTypes from 'prop-types';

// import ReactTooltip from 'react-tooltip';

import validate from './bookmark-form.validator';

import { Button, Textfield, useForm } from '@astrosat/astrosat-ui';

import formStyles from '../forms.module.css';
import bookmarkStyles from '../side-menu/side-menu.module.css';

const BookmarkForm = ({ bookmarkTitles, submit }) => {
  function onSubmit() {
    submit(values);
  }

  const { handleChange, handleSubmit, values, errors } = useForm(
    onSubmit,
    validate(bookmarkTitles),
  );

  return (
    <form
      className={`${formStyles.form} ${bookmarkStyles.form}`}
      onSubmit={handleSubmit}
    >
      <div className={`${formStyles.fields} ${bookmarkStyles.fields}`}>
        <label className={formStyles.hiddenLabel} htmlFor="title">
          Title
        </label>
        <Textfield
          id="title"
          name="title"
          value={values.title || ''}
          placeholder="Title"
          onChange={handleChange}
          required
          autoFocus
        />
        {errors.title && (
          <p className={formStyles.errorMessage}>{errors.title}</p>
        )}

        <label className={formStyles.hiddenLabel} htmlFor="description">
          Description
        </label>
        <Textfield
          id="description"
          name="description"
          value={values.description || ''}
          placeholder="Description"
          onChange={handleChange}
        />
      </div>

      <Button
        type="submit"
        disabled={
          Object.keys(errors).length > 0 || Object.keys(values).length === 0
        }
      >
        Save Map
      </Button>
    </form>
  );
};

BookmarkForm.propTypes = {
  submit: PropTypes.func.isRequired,
};

export default BookmarkForm;
