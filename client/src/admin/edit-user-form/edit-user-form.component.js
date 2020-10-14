import React from 'react';

import { Button, Checkbox, Radio, Textfield } from '@astrosat/astrosat-ui';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { FieldError } from 'components/field-error/field-error.component';
import { FIELD_NAMES, name } from 'utils/validators';
import { ADMIN_STATUS } from '../admin.constants';
import { getCheckboxLicences, getUpdatedLicenceIds } from '../licence-utils';

import styles from './edit-user-form.module.css';

const validationSchema = yup.object({
  [FIELD_NAMES.name]: name,
});

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
      name: user.user.name,
      type: user.type,
    };

    for (let licence of checkboxLicences) {
      defaults[licence.orb] = licence.customer_user === user.id;
    }

    return defaults;
  };

  const { register, handleSubmit, errors, formState } = useForm({
    defaultValues: getDefaults(),
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = values => {
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
  };

  return (
    <form className={styles.editForm} onSubmit={handleSubmit(onSubmit)}>
      <Textfield name={FIELD_NAMES.name} ref={register} placeholder="Name" />

      {errors[FIELD_NAMES.name] && (
        <FieldError message={errors[FIELD_NAMES.name].message} />
      )}

      <Textfield name="email" value={user.user.email} readOnly />

      <h2 className={styles.title}>Project Access</h2>
      <div className={styles.checkboxes}>
        {checkboxLicences.map(l => (
          <Checkbox
            id={l.id}
            key={l.id}
            name={l.orb}
            label={l.orb}
            ref={register}
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
          ref={register}
        />
        <Radio
          label="No"
          id="No"
          name="type"
          value={ADMIN_STATUS.member}
          ref={register}
          disabled={oneAdminRemaining}
        />
      </div>

      <Button
        type="submit"
        className={styles.button}
        disabled={!formState.isDirty || Object.keys(errors).length > 0}
      >
        Save Changes
      </Button>
    </form>
  );
};
