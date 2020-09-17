import React from 'react';
import PropTypes from 'prop-types';

import Button from '@astrosat/astrosat-ui/dist/buttons/button';
import Textfield from '@astrosat/astrosat-ui/dist/forms/text-field';
import useForm from '@astrosat/astrosat-ui/dist/forms/use-form';

import styles from './update-user-form.module.css';
import formStyles from '../../forms.module.css';

const UpdateUserForm = ({ user, updateUser }) => {
  const defaults = {
    values: {
      name: user?.name || '',
    },
  };

  const { handleChange, handleSubmit, values } = useForm(
    onSubmit,
    () => ({}),
    defaults,
  );

  function onSubmit() {
    updateUser(values);
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <p className={formStyles.paragraph}>Personal Details</p>
      <div className={formStyles.row}>
        <Textfield
          name="email"
          value={user?.email || ''}
          placeholder="Email"
          onChange={handleChange}
          readOnly
        />
      </div>
      <div className={formStyles.row}>
        <Textfield
          name="name"
          value={values?.name || ''}
          placeholder="Name"
          onChange={handleChange}
        />
      </div>
      <Button className={styles.submit} type="submit">
        Update Account
      </Button>
    </form>
  );
};

UpdateUserForm.propTypes = {
  user: PropTypes.object.isRequired,
  updateUser: PropTypes.func.isRequired,
};

export default UpdateUserForm;
