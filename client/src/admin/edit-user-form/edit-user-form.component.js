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
    // This returns a combined array of the user's current licences,
    // and one of each type of available licence that the user does
    // not already have.

    const userLicences = customer.licences.filter(
      l => l.customer_user === user.id,
    );

    let allLicences = [...userLicences];

    for (let licence of availableLicences) {
      const orbNames = allLicences.map(l => l.orb);
      if (!orbNames.includes(licence.orb)) {
        allLicences = [...allLicences, licence];
      }
    }

    return allLicences;
  };

  const getDefaults = () => {
    // This goes through the array of sorted licences for the user,
    // and assigns a key of each licence's name to the default values
    // object, with true/false for assigned/available.

    const defaults = {
      values: {
        name: user.user.name ? user.user.name : '',
        type: user.type,
      },
    };

    for (let licence of getCheckboxLicences()) {
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

  const getUpdatedLicenceIds = values => {
    // The checked licence boxes will be the only elements with 'true' values,
    // so only they make it past the if check. If all are false (unchecked),
    // an empty array is returned.

    // It then returns a licence of the correct type from the customer,
    // searching first for one already assigned to the user, and failing that,
    // the first available one of the correct type.

    let newIds = [];
    Object.keys(values).forEach(key => {
      if (values[key] === true) {
        let licence;

        licence = customer.licences.find(
          l => l.orb === key && l.customer_user === user.id,
        );

        if (!licence)
          licence = customer.licences.find(
            l => l.orb === key && l.customer_user === null,
          );

        newIds = [...newIds, licence.id];
      }
    });
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
        disabled={!hasMadeChanges(values) || Object.keys(errors).length > 0}
      >
        Save Changes
      </Button>
    </form>
  );
};
