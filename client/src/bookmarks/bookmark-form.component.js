import React from 'react';
import PropTypes from 'prop-types';

// import ReactTooltip from 'react-tooltip';

// import useForm from '../hooks/useForm';
import validate from './bookmark-form.validator';

import Button from '@astrosat/astrosat-ui/dist/buttons/button';
import Textfield from '@astrosat/astrosat-ui/dist/forms/text-field';
import useForm from '@astrosat/astrosat-ui/dist/forms/use-form';
// import { Button, Textfield } from '@astrosat/astrosat-ui';

import formStyles from '../accounts/forms.module.css';
// import bookmarkStyles from './bookmark-form.module.css';

const BookmarkForm = ({ submit }) => {
  function onSubmit() {
    console.log('Submitting Form');
    submit(values);
  }

  const { handleChange, handleSubmit, values, errors } = useForm(onSubmit, validate);

  return (
    <div className={formStyles.container}>
      <form className={formStyles.form} onSubmit={handleSubmit}>
        <div className={formStyles.fields}>
          <div className={formStyles.row}>
            <Textfield
              name="title"
              value={values.title || ''}
              placeholder="Email"
              onChange={handleChange}
              required
              autoFocus
            />
          </div>
          {errors.title && <p className={formStyles.errorMessage}>{errors.title}</p>}
        </div>

        <div className={formStyles.buttons}>
          <Button
            type="submit"
            className={formStyles.button}
            disabled={Object.keys(errors).length > 0 || Object.keys(values).length === 0}
          >
            Save Bookmark
          </Button>
        </div>
      </form>
    </div>
  );
};

BookmarkForm.propTypes = {
  submit: PropTypes.func.isRequired
};

export default BookmarkForm;
