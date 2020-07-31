import React from 'react';

import {
  useForm,
  Button,
  Textfield,
  Radio,
  Checkbox,
} from '@astrosat/astrosat-ui';

import validate from './edit-user-form-validator';

import { getUserLicences } from '../get-user-licences-helper';

import styles from './edit-user-form.module.css';

export const EditUserForm = ({ user, customer, editUser, close }) => {
  const { handleChange, handleSubmit, values, errors } = useForm(
    onSubmit,
    validate,
  );

  const userLicences = getUserLicences(user, customer);

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

  const getUpdatedLicences = values => {
    let newIds = [];
    for (let key of Object.keys(values)) {
      if (userLicences.includes(key) && values[key]) {
        const licence = customer?.licences.find(
          l => l.customer_user === user.user.id && l.orb === key,
        );
        newIds = [...newIds, licence.id];
      }
    }
    return newIds;
  };

  function onSubmit() {
    const editedUser = {
      ...user,
      type: values.type,
      licences: getUpdatedLicences(values),
      user: {
        ...user.user,
        name: values.name,
        email: values.email,
      },
    };
    editUser(editedUser);
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
          <Checkbox key={l} name={l} label={l} onChange={handleChange} />
        ))}
      </div>

      <h2 className={styles.title}>Admin Rights</h2>
      <div className={styles.radios}>
        <Radio
          label="Yes"
          id="yes"
          name="type"
          value="MANAGER"
          onChange={handleChange}
        />
        <Radio
          label="No"
          id="No"
          name="type"
          value="MEMBER"
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
