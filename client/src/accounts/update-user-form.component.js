import React from 'react';
import PropTypes from 'prop-types';

import Button from '@astrosat/astrosat-ui/dist/buttons/button';
import Textfield from '@astrosat/astrosat-ui/dist/forms/text-field';
import useForm from '@astrosat/astrosat-ui/dist/forms/use-form';

import formStyles from './forms.module.css';
import sideMenuStyles from '../side-menu/side-menu.module.css';
import profileStyles from './profile.module.css';

const UpdateUserForm = ({ user, updateUser }) => {
  const defaults = {
    values: {
      name: user.name ? user.name : '',
    },
  };

  const { handleChange, handleSubmit, values } = useForm(onSubmit, () => ({}), defaults);

  function onSubmit() {
    updateUser(values);
  }

  return (
    <div className={`${formStyles.container} ${sideMenuStyles.container}`}>
      <form className={`${formStyles.form} ${sideMenuStyles.form}`} onSubmit={handleSubmit}>
        <div className={`${formStyles.fields} ${sideMenuStyles.fields}`}>
          <p className={sideMenuStyles.header}>Personal Details</p>
          <Textfield name="email" value={user.email || ''} placeholder="Email" onChange={handleChange} readOnly />

          <Textfield name="name" value={values.name || ''} placeholder="Name" onChange={handleChange} />
        </div>
        <div className={sideMenuStyles.buttons}>
          <Button type="submit" classNames={[sideMenuStyles.button, profileStyles.updateAccountButton]}>
            Update Account
          </Button>
        </div>
      </form>
    </div>
  );
};

UpdateUserForm.propTypes = {
  user: PropTypes.object.isRequired,
  updateUser: PropTypes.func.isRequired,
};

export default UpdateUserForm;
