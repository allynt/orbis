import React from 'react';

import { useForm, Button, Textfield, Radio } from '@astrosat/astrosat-ui';

import validate from './edit-user-form-validator';

import { getUserLicences } from '../get-user-licences-helper';

import styles from './edit-user-form.module.css';

export const EditUserForm = ({ user, customer, editUser, close }) => {
  const { handleChange, handleSubmit, values, errors } = useForm(
    onSubmit,
    validate,
  );

  const hasMadeChanges = values => {
    let bool = false;
    if (Object.keys(values).length === 0) {
      return bool;
    } else {
      for (let key of Object.keys(values)) {
        if (values[key] !== '') {
          bool = true;
          break;
        }
      }
      return bool;
    }
  };

  const userLicences = getUserLicences(user, customer);

  function onSubmit() {
    editUser(values);
    close();
  }
  return (
    <form className={styles.editForm} onSubmit={handleSubmit}>
      <Textfield
        name="name"
        value={values.name || ''}
        placeholder={user.user.name}
        onChange={handleChange}
      />
      <Textfield
        name="email"
        value={values.email || ''}
        placeholder={user.user.email}
        onChange={handleChange}
      />

      <h2 className={styles.title}>Project Access</h2>
      <div className={styles.radios}>
        {userLicences.map(l => (
          <Radio key={l} label={l} checked={true} onChange={handleChange} />
        ))}
      </div>

      <h2 className={styles.title}>Admin Rights</h2>
      <div className={styles.radios}>
        <Radio
          label="Yes"
          checked={user.type === 'MANAGER'}
          onChange={handleChange}
        />
        <Radio
          label="No"
          checked={user.type !== 'MANAGER'}
          onChange={handleChange}
        />
      </div>

      <Button
        type="submit"
        className={styles.button}
        disabled={!hasMadeChanges(values)}
      >
        Save Changes
      </Button>
    </form>
  );
};
