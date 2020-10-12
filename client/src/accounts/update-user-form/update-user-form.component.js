import React from 'react';

import { Button, Textfield } from '@astrosat/astrosat-ui';

import { useForm } from 'react-hook-form';

import styles from './update-user-form.module.css';
import formStyles from '../../forms.module.css';

const EMAIL_FIELD_ID = 'email-field';
const NAME_FIELD_ID = 'name-field';

const UpdateUserForm = ({ user, updateUser }) => {
  const { handleSubmit, register } = useForm({
    defaultValues: { email: user?.email, name: user?.name },
  });

  const onSubmit = values => {
    updateUser(values);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <p className={formStyles.paragraph}>Personal Details</p>
      <div className={formStyles.row}>
        <label className={formStyles.hiddenLabel} htmlFor={EMAIL_FIELD_ID}>
          Email
        </label>
        <Textfield
          id={EMAIL_FIELD_ID}
          name="email"
          ref={register}
          placeholder="Email"
          readOnly
        />
      </div>
      <div className={formStyles.row}>
        <label className={formStyles.hiddenLabel} htmlFor={NAME_FIELD_ID}>
          Name
        </label>
        <Textfield
          id={NAME_FIELD_ID}
          name="name"
          ref={register}
          placeholder="Name"
        />
      </div>
      <Button className={styles.submit} type="submit">
        Update Account
      </Button>
    </form>
  );
};

export default UpdateUserForm;
