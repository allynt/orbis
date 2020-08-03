import React from 'react';

import {
  useForm,
  Button,
  Textfield,
  Radio,
  Checkbox,
} from '@astrosat/astrosat-ui';

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
  const getCheckboxLicences = () => {
    const userLicences = customer.licences.filter(
      l => l.customer_user === user.user.id,
    );

    let allLicences = [...userLicences];

    for (let licence of availableLicences) {
      if (!allLicences.map(l => l.orb).includes(licence.orb)) {
        allLicences = [...allLicences, licence];
      }
    }

    return allLicences;
  };

  const getDefaults = () => {
    const defaults = {
      values: {
        name: user.user.name ? user.user.name : '',
        type: user.type === 'MANAGER' ? 'MANAGER' : 'MEMBER',
      },
    };

    for (let licence of getCheckboxLicences()) {
      defaults.values[licence.orb] =
        licence.customer_user === user.user.id ? true : false;
    }

    return defaults;
  };

  const { handleChange, handleSubmit, values, errors } = useForm(
    onSubmit,
    validate,
    getDefaults(),
  );

  console.log('Errors: ', errors);

  const hasMadeChanges = values => {
    let bool = false;
    if (Object.keys(values).length === 0) {
      return bool;
    } else {
      const defaults = getDefaults().values;
      for (let key of Object.keys(defaults)) {
        if (values[key] !== defaults[key]) {
          bool = true;
          break;
        }
      }
      return bool;
    }
  };

  const getUpdatedLicenceIds = values => {
    let newIds = [];
    for (let key of Object.keys(values)) {
      if (values[key] === true) {
        const licence = customer.licences.find(
          l =>
            l.orb === key &&
            (l.customer_user === user.user.id || l.customer_user === null),
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
      licences: getUpdatedLicenceIds(values),
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
        {getCheckboxLicences().map(l => (
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
          value="MANAGER"
          checked={values.type === 'MANAGER'}
          onChange={handleChange}
        />
        <Radio
          label="No"
          id="No"
          name="type"
          value="MEMBER"
          checked={values.type === 'MEMBER'}
          onChange={handleChange}
          disabled={oneAdminRemaining}
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
