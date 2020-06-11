import React from 'react';
import PropTypes from 'prop-types';

// import ReactTooltip from 'react-tooltip';

import validate from './bookmark-form.validator';

import Button from '@astrosat/astrosat-ui/dist/buttons/button';
import Textfield from '@astrosat/astrosat-ui/dist/forms/text-field';
import useForm from '@astrosat/astrosat-ui/dist/forms/use-form';

import formStyles from '../accounts/forms.module.css';
import bookmarkStyles from '../side-menu/side-menu.module.css';

const BookmarkForm = ({ bookmarkTitles, submit }) => {
  function onSubmit() {
    submit(values);
  }

  const { handleChange, handleSubmit, values, errors } = useForm(onSubmit, validate(bookmarkTitles));

  return (
    <form className={`${formStyles.form} ${bookmarkStyles.form}`} onSubmit={handleSubmit}>
      <div className={`${formStyles.fields} ${bookmarkStyles.fields}`}>
        <Textfield
          name="title"
          value={values.title || ''}
          placeholder="Title"
          onChange={handleChange}
          required
          autoFocus
        />
        {errors.title && <p className={formStyles.errorMessage}>{errors.title}</p>}

        <Textfield
          name="description"
          value={values.description || ''}
          placeholder="Description"
          onChange={handleChange}
        />
      </div>

      <Button type="submit" disabled={Object.keys(errors).length > 0 || Object.keys(values).length === 0}>
        Save Map
      </Button>
    </form>
  );
};

BookmarkForm.propTypes = {
  submit: PropTypes.func.isRequired,
};

export default BookmarkForm;
