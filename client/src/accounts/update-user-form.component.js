import React from 'react';
import PropTypes from 'prop-types';

// import useForm from '../hooks/useForm';
import validate from './update-user-form.validator';

import Button from '@astrosat/astrosat-ui/dist/buttons/button';
import Textfield from '@astrosat/astrosat-ui/dist/forms/text-field';
import Select from '@astrosat/astrosat-ui/dist/forms/select';
import useForm from '@astrosat/astrosat-ui/dist/forms/use-form';
import Well from '@astrosat/astrosat-ui/dist/containers/well';
// import { Button, Textfield, TextArea } from '@astrosat/astrosat-ui';

import formStyles from './forms.module.css';
import userStyles from './update-user-form.module.css';
import { styles } from '@astrosat/astrosat-ui/dist/text-field.module-3ed65b3d';

const UpdateUserForm = ({ user, updateUser }) => {
  const { handleChange, handleSubmit, values, errors } = useForm(onSubmit, validate);

  function onSubmit() {
    updateUser(values);
  }

  return (
    <div className={userStyles.container}>
      <form className={`${formStyles.form} ${userStyles.form}`} onSubmit={handleSubmit}>
        <div className={`${formStyles.fields} ${userStyles.fields}`}>
          <p className={userStyles.infoHeader}>Personal Details</p>
          <div className={formStyles.row}>
            <Textfield classNames={[userStyles.textfield]} name="email" value={user.email || ''} placeholder="Email" onChange={handleChange} readOnly />
          </div>
          {errors.email && <p className={formStyles.errorMessage}>{errors.email}</p>}

          <div className={formStyles.row}>
            <Textfield
            classNames={[userStyles.textfield]}
              name="name"
              value={user.name || values.name || ''}
              placeholder="Full Name"
              onChange={handleChange}
              autoFocus
            />
          </div>
          {errors.first_name && <p className={formStyles.errorMessage}>{errors.first_name}</p>}

          <div className={formStyles.row}>
            <Textfield
            classNames={[userStyles.textfield]}
              name="first_name"
              value={user.first_name || values.first_name || ''}
              placeholder="First Name"
              onChange={handleChange}
            />
          </div>
          {errors.first_name && <p className={formStyles.errorMessage}>{errors.first_name}</p>}

          <div className={formStyles.row}>
            <Textfield
            classNames={[userStyles.textfield]}
              name="last_name"
              value={user.last_name || values.last_name || ''}
              placeholder="Last Name"
              onChange={handleChange}
            />
          </div>
          {errors.last_name && <p className={formStyles.errorMessage}>{errors.last_name}</p>}

          <p className={userStyles.regionHeader}>Preferences</p>
          <div className={formStyles.row}>
            <Select classNames={[userStyles.select]} />
          </div>
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
