import React from 'react';

import {
  useForm,
  Button,
  Textfield,
  Radio,
  Checkbox,
} from '@astrosat/astrosat-ui';

import { getCheckboxLicences, getUpdatedLicenceIds } from '../licence-utils';

import { ADMIN_STATUS } from '../admin.constants';

import validate from './edit-user-form-validator';

import styles from './edit-user-form.module.css';

export const EditUserForm = ({
  user,
  customer,
  availableLicences,
  oneAdminRemaining,
  editUser,
  close,
}) => {
  const checkboxLicences = getCheckboxLicences(
    customer,
    user,
    availableLicences,
  );

  const getDefaults = () => {
    const defaults = {
      values: {
        name: user.user.name ? user.user.name : '',
        type: user.type,
      },
    };

    for (let licence of checkboxLicences) {
      defaults.values[licence.orb] =
        licence.customer_user === user.id ? true : false;
    }

    return defaults;
  };

  const { handleChange, handleSubmit, values, errors } = useForm(
    onSubmit,
    validate,
    getDefaults(),
  );

  const hasMadeChanges = values => {
    let bool = false;
    if (Object.keys(values).length === 0) {
      return bool;
    } else {
      const defaults = getDefaults().values;
      for (let key of Object.keys(defaults)) {
        if (values[key] !== defaults[key]) {
          bool = true;
          return bool;
        }
      }
    }
  };

  function onSubmit() {
    const editedUser = {
      ...user,
      type: values.type,
      licences: getUpdatedLicenceIds(customer, user, values),
      user: {
        ...user.user,
        name: values.name,
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
        placeholder="Name"
        onChange={handleChange}
      />

      {errors.name && <p className={styles.errorMessage}>{errors.name}</p>}

      <Textfield name="email" value={user.user.email} readOnly />

      <h2 className={styles.title}>Project Access</h2>
      <div className={styles.checkboxes}>
        {checkboxLicences.map(l => (
          <Checkbox
            key={l.id}
            name={l.orb}
            label={l.orb}
            checked={values[l.orb]}
            onChange={handleChange}
          />
        ))}
      </div>

      <h2 className={styles.title}>Admin Rights</h2>
      <div className={styles.radios}>
        <Radio
          label="Yes"
          id="yes"
          name="type"
          value={ADMIN_STATUS.manager}
          checked={values.type === ADMIN_STATUS.manager}
          onChange={handleChange}
        />
        <Radio
          label="No"
          id="No"
          name="type"
          value={ADMIN_STATUS.member}
          checked={values.type === ADMIN_STATUS.member}
          onChange={handleChange}
          disabled={oneAdminRemaining}
        />
      </div>

      <Button
        type="submit"
        className={styles.button}
        disabled={!hasMadeChanges(values) || Object.keys(errors).length > 0}
      >
        Save Changes
      </Button>
    </form>
  );
};
