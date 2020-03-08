import React from 'react';
import PropTypes from 'prop-types';

import { useDispatch } from 'react-redux';

import Button from '@astrosat/astrosat-ui/dist/buttons/button';
import Textfield from '@astrosat/astrosat-ui/dist/forms/text-field';
import useForm from '@astrosat/astrosat-ui/dist/forms/use-form';

import validate from './save-search-form.validator';

import { saveSatelliteSearch } from './satellites.actions';

import styles from './save-search-from.module.css';
import formStyles from '../accounts/forms.module.css';

const SaveSearchForm = () => {
  const dispatch = useDispatch();

  const { handleChange, handleSubmit, values, errors } = useForm(onSubmit, validate);

  function onSubmit() {
    console.log('Submitting: ', values);
    dispatch(saveSatelliteSearch(values));
  }

  return (
    <div>
      <form className={formStyles.form} onSubmit={handleSubmit}>
        <div className={formStyles.fields}>
          <div className={formStyles.row}>
            <Textfield
              name="title"
              value={values.title || ''}
              placeholder="Title"
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
            theme="primary"
            className={formStyles.button}
            disabled={Object.keys(errors).length > 0 || Object.keys(values).length === 0}
          >
            Save Search
          </Button>
        </div>
      </form>
    </div>
  );
};

SaveSearchForm.propTypes = {};

export default SaveSearchForm;
