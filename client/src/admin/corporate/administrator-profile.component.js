import React from 'react';

import { useForm, Button, Textfield } from '@astrosat/astrosat-ui';

import validate from './corporate-account.validator';

import ContentWrapper from '../content-wrapper.component';

import styles from './corporate-account.module.css';

const AdministratorProfile = ({ user }) => {
  const { handleChange, handleSubmit, values, errors } = useForm(onSubmit, validate);

  function onSubmit() {
    console.log('Values: ', values);
  }

  const Field = ({ children }) => <div className={styles.fieldContainer}>{children}</div>;

  return (
    <ContentWrapper title={'Administrator'} user={user}>
      <form className={styles.corporateAccount} onSubmit={handleSubmit}>
        <div className={styles.logoContainer}>
          <img src={user.avatar} className={styles.logo} alt="Admin Avatar" />
          <Button theme="link" onClick={() => console.log('Upload new image!')}>
            Upload new image
          </Button>
          <Button theme="link" onClick={() => console.log('Remove!')}>
            Remove
          </Button>
        </div>

        <fieldset>
          <Field>
            <div className={styles.field}>
              <h2 className={styles.fieldKey}>Name:</h2>
              <Textfield name="name" value={values.name || user.name} onChange={handleChange} placeholder="Add Name" />
            </div>
            <div className={styles.field}>
              <h2 className={styles.fieldKey}>Email:</h2>
              <Textfield
                name="email"
                value={values.email || user.email}
                onChange={handleChange}
                placeholder="Add Email"
              />
            </div>
            <div className={styles.field}>
              <h2 className={styles.fieldKey}>Phone:</h2>
              <Textfield
                name="phone"
                value={values.phone || user.phone}
                onChange={handleChange}
                placeholder="Add Phone Number"
              />
            </div>
          </Field>

          <Field>
            <div className={styles.field}>
              <h2 className={styles.fieldKey}>Role:</h2>
              <Textfield
                name="name"
                value={values.name || user.type}
                onChange={handleChange}
                placeholder="Change Role"
              />
            </div>
          </Field>
        </fieldset>
        <Button theme="tertiary" type="submit">
          Update Changes
        </Button>
      </form>
    </ContentWrapper>
  );
};

export default AdministratorProfile;
