import React from 'react';
import PropTypes from 'prop-types';

import useForm from '../hooks/useForm';
import validate from './update-user-form.validator';

import { Button, Textfield } from '@astrosat/astrosat-ui';

import formStyles from './forms.module.css';
// import userStyles from './update-user-form.module.css';

const UpdateUserForm = ({ user, updateUser }) => {
  const { handleChange, handleSubmit, values, errors } = useForm(onSubmit, validate);

  function onSubmit() {
    updateUser(values);
  }

  return (
    <div className={formStyles.container}>
      <form className={formStyles.form} onSubmit={handleSubmit}>
        <div className={formStyles.fields}>
          <div className={formStyles.row}>
            <Textfield
              name="username"
              value={values.username || ''}
              placeholder="Username"
              onChange={handleChange}
              readOnly
            />
          </div>

          <div className={formStyles.row}>
            <Textfield name="email" value={values.email || ''} placeholder="Email" onChange={handleChange} autoFocus />
          </div>
          {errors.email && <p className={formStyles.errorMessage}>{errors.email}</p>}

          <div className={formStyles.row}>
            <Textfield
              name="first_name"
              value={values.first_name || user.first_name || ''}
              placeholder="First Name"
              onChange={handleChange}
            />
          </div>
          {errors.first_name && <p className={formStyles.errorMessage}>{errors.first_name}</p>}

          <div className={formStyles.row}>
            <Textfield
              name="last_name"
              value={values.last_name || user.last_name || ''}
              placeholder="Last Name"
              onChange={handleChange}
            />
          </div>
          {errors.last_name && <p className={formStyles.errorMessage}>{errors.last_name}</p>}
        </div>

        <div className={formStyles.buttons}>
          <Button
            type="submit"
            className={formStyles.button}
            disabled={Object.keys(errors).length > 0 || Object.keys(values).length === 0}
          >
            Update User
          </Button>
        </div>
      </form>
    </div>
  );
};

UpdateUserForm.propTypes = {
  user: PropTypes.object.isRequired,
  updateUser: PropTypes.func.isRequired
};

export default UpdateUserForm;
