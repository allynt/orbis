import React from 'react';
import PropTypes from 'prop-types';

import Button from '@astrosat/astrosat-ui/dist/buttons/button';
import Textfield from '@astrosat/astrosat-ui/dist/forms/text-field';
import Select from '@astrosat/astrosat-ui/dist/forms/select';
import useForm from '@astrosat/astrosat-ui/dist/forms/use-form';
import Well from '@astrosat/astrosat-ui/dist/containers/well';

import validate from './new-map-form.validator';

import formStyles from '../accounts/forms.module.css';
import styles from './new-map-form.module.css';

const domains = [
  { name: 'Option 1', value: { id: '1', title: 'Mr' } },
  {
    name: 'Option 2',
    value: [
      { id: '1', title: 'Mr' },
      { id: '2', title: 'Mrs' }
    ]
  },
  { name: 'Option 3', value: 'Mr' }
];

const regions = [
  { name: 'Option 1', value: { id: '1', title: 'Mr' } },
  {
    name: 'Option 2',
    value: [
      { id: '1', title: 'Mr' },
      { id: '2', title: 'Mrs' }
    ]
  },
  { name: 'Option 3', value: 'Mr' }
];

const NewMapForm = () => {
  const { handleChange, handleSubmit, values, errors } = useForm(onSubmit, validate);

  function onSubmit() {
    console.log('Submitting form: ', values);
  }
  console.log('ERRORS: ', errors);

  return (
    <div className={formStyles.container}>
      <form className={formStyles.form} onSubmit={handleSubmit}>
        {/* {error && (
          <Well type="error">
            <div>{error.message}</div>
          </Well>
        )} */}

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
            <Select onChange={event => console.log('Selected Domain: ', event)} options={domains} />
            <Select onChange={event => console.log('Selected Domain: ', event)} options={regions} />
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
