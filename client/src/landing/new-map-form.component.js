import React from 'react';

import { useHistory } from 'react-router-dom';

import Button from '@astrosat/astrosat-ui/dist/buttons/button';
import Textfield from '@astrosat/astrosat-ui/dist/forms/text-field';
import Select from '@astrosat/astrosat-ui/dist/forms/select';
import useForm from '@astrosat/astrosat-ui/dist/forms/use-form';

import validate from './new-map-form.validator';

import formStyles from '../accounts/forms.module.css';
// import styles from './new-map-form.module.css';

const NewMapForm = ({ regions, domains, setViewport }) => {
  const { handleChange, handleSubmit, values, errors } = useForm(onSubmit, validate);
  const history = useHistory();

  function onSubmit() {
    setViewport(values.region);
    history.push('/map');
  }

  return (
    <div className={formStyles.container}>
      <form className={formStyles.form} onSubmit={handleSubmit}>
        <div className={formStyles.fields}>
          <div className={formStyles.row}>
            <Textfield
              name="name"
              value={values.name || ''}
              placeholder="Add Name*"
              onChange={handleChange}
              required
              autoFocus
            />
          </div>
          {errors.name && <p className={formStyles.errorMessage}>{errors.name}</p>}

          <div className={formStyles.row}>
            <Textfield
              name="description"
              value={values.description || ''}
              placeholder="Add Description"
              onChange={handleChange}
            />
          </div>
          {errors.description && <p className={formStyles.errorMessage}>{errors.description}</p>}
        </div>

        <div className={formStyles.row}>
          <Select name="region" value={values.region || ''} options={regions} onChange={handleChange} />
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
            className={formStyles.button}
            disabled={Object.keys(errors).length > 0 || Object.keys(values).length === 0}
          >
            Create
          </Button>
        </div>
      </form>
    </div>
  );
};

NewMapForm.propTypes = {};

export default NewMapForm;
