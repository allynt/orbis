import React from 'react';
import PropTypes from 'prop-types';

import { useDispatch } from 'react-redux';

import Button from '@astrosat/astrosat-ui/dist/buttons/button';
import Textfield from '@astrosat/astrosat-ui/dist/forms/text-field';
import useForm from '@astrosat/astrosat-ui/dist/forms/use-form';

import validate from './save-search-form.validator';

import { saveSatelliteSearch } from './satellites.actions';

import formStyles from '../accounts/forms.module.css';

const SaveSearchForm = ({ query }) => {
  const dispatch = useDispatch();

  const { handleChange, handleSubmit, values, errors } = useForm(onSubmit, validate);

  function onSubmit() {
    console.log('Submitting: ', values, query);
    dispatch(saveSatelliteSearch({ ...values, ...query }));
  }

  return (
    <div>
      <form className={formStyles.form} onSubmit={handleSubmit}>
        <p>Please name your search. Find your saved searches alongside your saved AOIs under "Saved Searches"</p>
        <div className={formStyles.fields}>
          <div className={formStyles.row}>
            <Textfield
              name="name"
              value={values.name || ''}
              placeholder="Name"
              onChange={handleChange}
              required
              autoFocus
            />
          </div>
          {errors.name && <p className={formStyles.errorMessage}>{errors.name}</p>}
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
