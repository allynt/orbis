import React from 'react';

import { useForm } from 'react-hook-form';

import { Textfield, ProfileIcon, Button } from '@astrosat/astrosat-ui';

import ContentWrapper from '../../content-wrapper.component';

import { Field } from '../corporate-view.component';

import styles from '../corporate-view.module.css';

const AdministratorProfile = ({ user, updateAdministrator }) => {
  const formFields = ['name', 'email', 'phone'];

  const getDefaults = () => {
    let defaults = {};
    formFields.forEach(field => {
      if (user[field]) {
        defaults = { ...defaults, [field]: user[field] };
      }
    });
    return defaults;
  };

  function onSubmit(values) {
    let newUser = { ...user };
    formFields.forEach(field => {
      if (values[field]) {
        newUser = { ...newUser, [field]: values[field] };
      }
    });
    updateAdministrator(newUser);
  }

  const { register, handleSubmit, errors, formState } = useForm({
    defaultValues: getDefaults(),
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

        <fieldset>
          <Field>
            <div className={styles.field}>
              <label htmlFor="name" className={styles.fieldLabel}>
                Name:
              </label>
              <Textfield
                id="name"
                name="name"
                placeholder="Add Name"
                ref={register}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="email" className={styles.fieldLabel}>
                Email:
              </label>
              <Textfield
                id="email"
                name="email"
                placeholder="Add Email"
                ref={register}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="phone" className={styles.fieldLabel}>
                Phone:
              </label>
              <Textfield
                id="phone"
                name="phone"
                placeholder="Add Phone Number"
                ref={register}
              />
            </div>
          </Field>
        </fieldset>
        <Button type="submit" disabled={!formState.isDirty}>
          Update Changes
        </Button>
      </form>
    </ContentWrapper>
  );
};

export default AdministratorProfile;
