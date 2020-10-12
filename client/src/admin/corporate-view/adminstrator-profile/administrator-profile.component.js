import React from 'react';

import { useForm, Textfield, ProfileIcon } from '@astrosat/astrosat-ui';

import ContentWrapper from '../../content-wrapper.component';

import { Field } from '../corporate-view.component';

import styles from '../corporate-view.module.css';

const AdministratorProfile = ({ user }) => {
  const { handleChange, handleSubmit, values } = useForm(
    () => {},
    () => ({}),
  );

  return (
    <ContentWrapper title="Administrator">
      <form className={styles.corporateAccount} onSubmit={handleSubmit}>
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
                value={values.name || user.name}
                onChange={handleChange}
                placeholder="Add Name"
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="email" className={styles.fieldLabel}>
                Email:
              </label>
              <Textfield
                id="email"
                name="email"
                value={values.email || user.email}
                onChange={handleChange}
                placeholder="Add Email"
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="phone" className={styles.fieldLabel}>
                Phone:
              </label>
              <Textfield
                id="phone"
                name="phone"
                value={values.phone || user.phone}
                onChange={handleChange}
                placeholder="Add Phone Number"
              />
            </div>
          </Field>
        </fieldset>
      </form>
    </ContentWrapper>
  );
};

export default AdministratorProfile;
