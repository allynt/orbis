import React from 'react';

import { useForm } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { FIELD_NAMES, email } from 'utils/validators';

import { Textfield, ProfileIcon, Button } from '@astrosat/astrosat-ui';

import ContentWrapper from '../../content-wrapper.component';

import { Field } from '../corporate-form-field.component';
import { FieldError } from 'components/field-error/field-error.component';

import styles from '../corporate-view.module.css';

const AdministratorProfileSchema = yup.object({
  [FIELD_NAMES.email]: email,
});

const AdministratorProfile = ({ user, updateAdministrator }) => {
  function onSubmit(values) {
    let newUser = { ...user, ...values };
    updateAdministrator(newUser);
  }

  const { register, handleSubmit, errors, formState } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(AdministratorProfileSchema),
    defaultValues: user,
  });

  return (
    <ContentWrapper title="Administrator">
      <form
        className={styles.corporateAccount}
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className={styles.logoContainer}>
          {user.avatar ? (
            <img src={user.avatar} className={styles.logo} alt="Admin Avatar" />
          ) : (
            <ProfileIcon title="Profile Icon" classes={styles.defaultIcon} />
          )}
        </div>

        <Field>
          <div className={styles.field}>
            <label htmlFor={FIELD_NAMES.name} className={styles.fieldLabel}>
              Name:
            </label>
            <Textfield
              id={FIELD_NAMES.name}
              name={FIELD_NAMES.name}
              placeholder="Add Name"
              ref={register}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor={FIELD_NAMES.email} className={styles.fieldLabel}>
              Email:
            </label>
            <Textfield
              id={FIELD_NAMES.email}
              name={FIELD_NAMES.email}
              placeholder="Add Email"
              ref={register}
            />
            {errors.email && (
              <div className={styles.errorContainer}>
                <FieldError message={errors.email.message} />
              </div>
            )}
          </div>
          <div className={styles.field}>
            <label htmlFor={FIELD_NAMES.phone} className={styles.fieldLabel}>
              Phone:
            </label>
            <Textfield
              id={FIELD_NAMES.phone}
              name={FIELD_NAMES.phone}
              placeholder="Add Phone Number"
              ref={register}
            />
          </div>
        </Field>

        <Button
          type="submit"
          disabled={Object.keys(errors).length > 0 || !formState.isDirty}
        >
          Update Changes
        </Button>
      </form>
    </ContentWrapper>
  );
};

export default AdministratorProfile;
