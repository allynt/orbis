import React from 'react';
import PropTypes from 'prop-types';

import Button from '@astrosat/astrosat-ui/dist/buttons/button';
import useForm from '@astrosat/astrosat-ui/dist/forms/use-form';

import validate from './user-detail-form.validator';

import styles from './user-detail-form.module.css';

const UserDetailForm = ({ customer, createCustomerUser }) => {
  const { handleChange, handleSubmit, reset, values, errors } = useForm(onSubmit, validate);

  function onSubmit() {
    createCustomerUser(customer, values);
  }

  return (
    <div className={styles['user-detail-form-container']}>
      <form className={styles['user-detail-form']} onSubmit={handleSubmit}>
        <h3>Create New User</h3>

        <div className={styles['form-row']}>
          <label className={styles.label}>
            Email Address:
            <input
              className={`${styles.input} ${errors.email ? styles.error : ''}`}
              type="email"
              name="email"
              onChange={handleChange}
              value={values.email || ''}
              required
            />
          </label>
          <em className={styles.required}>(Required)</em>
        </div>
        {errors.email && <p className={styles['error-message']}>{errors.email}</p>}

        <div className={styles['form-row']}>
          <label className={styles.label}>
            Password:
            <input
              className={`${styles.input} ${errors.password1 ? styles.error : ''}`}
              type="password"
              name="password1"
              onChange={handleChange}
              value={values.password1 || ''}
              required
            />
          </label>
          <em className={styles.required}>(Required)</em>
        </div>
        {errors.password1 && <p className={styles['error-message']}>{errors.password1}</p>}

        <div className={styles['form-row']}>
          <label className={styles.label}>
            Password (Confirm):
            <input
              className={`${styles.input} ${errors.password2 ? styles.error : ''}`}
              type="password"
              name="password2"
              onChange={handleChange}
              value={values.password2 || ''}
              required
            />
          </label>
          <em className={styles.required}>(Required)</em>
        </div>
        {errors.password2 && <p className={styles['error-message']}>{errors.password2}</p>}

        <div className={styles.buttons}>
          <Button className={styles.button} onClick={reset} disabled={Object.keys(values).length === 0}>
            Reset
          </Button>

          <Button
            type="submit"
            className={styles.button}
            disabled={Object.keys(errors).length > 0 || Object.keys(values).length === 0}
          >
            Create User
          </Button>
        </div>
      </form>
    </div>
  );
};

UserDetailForm.propTypes = {
  createCustomerUser: PropTypes.func.isRequired,
};

export default UserDetailForm;