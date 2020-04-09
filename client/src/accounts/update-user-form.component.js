import React from 'react';
import PropTypes from 'prop-types';

import validate from './update-user-form.validator';

import Button from '@astrosat/astrosat-ui/dist/buttons/button';
import Textfield from '@astrosat/astrosat-ui/dist/forms/text-field';
import Select from '@astrosat/astrosat-ui/dist/forms/select';
import useForm from '@astrosat/astrosat-ui/dist/forms/use-form';

import formStyles from './forms.module.css';
import sideMenuStyles from '../side-menu/side-menu.module.css';
import profileStyles from './profile.module.css';

const UpdateUserForm = ({ user, updateUser }) => {
  const { handleChange, handleSubmit, values, errors } = useForm(onSubmit, validate);

  function onSubmit() {
    updateUser(values);
  }

  return (
    <div className={`${formStyles.container} ${sideMenuStyles.container}`}>
      <form className={`${formStyles.form} ${sideMenuStyles.form}`} onSubmit={handleSubmit}>
        <div className={`${formStyles.fields} ${sideMenuStyles.fields}`}>
          <p className={sideMenuStyles.header}>Personal Details</p>
          <Textfield name="email" value={user.email || ''} placeholder="Email" onChange={handleChange} readOnly />
          {errors.email && <p className={formStyles.errorMessage}>{errors.email}</p>}

          <Textfield
            name="first_name"
            value={user.first_name || values.first_name || ''}
            placeholder="First Name"
            onChange={handleChange}
          />
          {errors.first_name && <p className={formStyles.errorMessage}>{errors.first_name}</p>}

          <Textfield
            name="last_name"
            value={user.last_name || values.last_name || ''}
            placeholder="Last Name"
            onChange={handleChange}
          />
          {errors.last_name && <p className={formStyles.errorMessage}>{errors.last_name}</p>}
        </div>
        <div className={sideMenuStyles.buttons}>
          <Button
            type="submit"
            classNames={[sideMenuStyles.button, profileStyles.profileButton]}
            disabled={Object.keys(errors).length > 0 || Object.keys(values).length === 0}
          >
            Update Account
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
