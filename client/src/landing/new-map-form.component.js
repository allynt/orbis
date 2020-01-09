import React from 'react';
import PropTypes from 'prop-types';

import { useDispatch, useSelector } from 'react-redux';

import Button from '@astrosat/astrosat-ui/dist/buttons/button';
import Textfield from '@astrosat/astrosat-ui/dist/forms/text-field';
import Select from '@astrosat/astrosat-ui/dist/forms/select';
import useForm from '@astrosat/astrosat-ui/dist/forms/use-form';
import Well from '@astrosat/astrosat-ui/dist/containers/well';

import validate from './new-map-form.validator';

import formStyles from '../accounts/forms.module.css';
import styles from './new-map-form.module.css';
import { setViewport } from '../map/map.actions';
import { useHistory } from 'react-router-dom';
// const domains = [
//   { name: 'Option 1', value: { id: '1', title: 'Mr' } },
//   {
//     name: 'Option 2',
//     value: [
//       { id: '1', title: 'Mr' },
//       { id: '2', title: 'Mrs' }
//     ]
//   },
//   { name: 'Option 3', value: 'Mr' }
// ];

// const regions = [
//   { name: 'Option 1', value: { id: '1', title: 'Mr' } },
//   {
//     name: 'Option 2',
//     value: [
//       { id: '1', title: 'Mr' },
//       { id: '2', title: 'Mrs' }
//     ]
//   },
//   { name: 'Option 3', value: 'Mr' }
// ];

const NewMapForm = () => {
  const { handleChange, handleSubmit, values, errors } = useForm(onSubmit, validate);
  const regions = useSelector(state => state.map.regions);
  const domains = useSelector(state => state.map.domains);
  const dispatch = useDispatch();
  const history = useHistory();

  function onSubmit() {
    console.log('Submitting form: ', values);
    dispatch(setViewport(values.region));
    history.push('/map');
  }
  console.log('ERRORS: ', errors);
  console.log('VALUES: ', values);

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
          <Select name="region" value={values.region || ''} options={regions} onChange={handleChange} />
          <Select name="domain" value={values.domain || ''} options={domains} onChange={handleChange} disabled={values.region ? false : true} />
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
