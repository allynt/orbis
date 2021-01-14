import React from 'react';

import { Button, TextField, useForm } from '@astrosat/astrosat-ui';

import validate from './save-search-form.validator';

import formStyles from '../forms.module.css';
import styles from './save-search-form.module.css';

const SaveSearchForm = ({ query, close, saveSearch }) => {
  const { handleChange, handleSubmit, values, errors } = useForm(
    onSubmit,
    validate,
  );

  function onSubmit() {
    saveSearch({ ...values, ...query });
    close();
  }

  return (
    <div className={styles.saveSearchForm}>
      <form className={formStyles.form} onSubmit={handleSubmit}>
        <p>
          Please name your search. Find your saved searches alongside your saved
          AOIs under "Saved Searches"
        </p>
        <div className={formStyles.fields}>
          <div className={formStyles.row}>
            <TextField
              name="name"
              value={values.name || ''}
              placeholder="Name"
              onChange={handleChange}
              required
              autoFocus
            />
          </div>
          {errors.name && (
            <p className={formStyles.errorMessage}>{errors.name}</p>
          )}
        </div>

        <div className={formStyles.buttons}>
          <Button
            type="submit"
            theme="primary"
            disabled={
              Object.keys(errors).length > 0 || Object.keys(values).length === 0
            }
          >
            Save Search
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SaveSearchForm;
