import React from 'react';
import { useForm } from 'react-hook-form';
import { Button, Checkbox, Textfield } from '@astrosat/astrosat-ui';
import styles from '../create-user-form/create-user-form.module.css';
import formStyles from 'forms.module.css';
// import { editUserFormValidator } from './edit-user-form.validator';

/**
 * @param {{licenceInformation?: {
 *            [key: string]: {
 *              purchased: number,
 *              available: number,
 *              active: number,
 *              pending: number
 *            }
 *          },
 *          onSubmit({name: string, email: string, licences: string[]}): void
 *        }} props
 */
export const EditUserForm = ({ licenceInformation, user, onSubmit }) => {
  const { register, handleSubmit, errors } = useForm();

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit(v => onSubmit && onSubmit(v))}
    >
      <div className={formStyles.row}>
        <label className={formStyles.hiddenLabel} htmlFor="name">
          Name
        </label>
        <Textfield
          ref={register}
          value={user.user.name}
          name="name"
          id="name"
          placeholder="Name"
        />
      </div>
      <div className={`${formStyles.row} ${errors.email && styles.error}`}>
        <label className={formStyles.hiddenLabel} htmlFor="email">
          Email
        </label>
        <div className={styles.field}>
          <Textfield
            ref={register}
            value={user.user.email}
            name="email"
            id="email"
            placeholder="Email"
          />
          <p className={styles.errorMessage}>{errors.email}</p>
        </div>
      </div>
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Licences</legend>
        <div className={styles.licences}>
          {licenceInformation && Object.keys(licenceInformation)?.length ? (
            Object.keys(licenceInformation).map(orb => (
              <Checkbox
                className={styles.licence}
                key={orb}
                label={orb}
                ref={register}
                name="licences"
                value={orb}
                disabled={licenceInformation[orb].available <= 0}
              />
            ))
          ) : (
            <p className={styles.noLicencesText}>No Licences Available</p>
          )}
        </div>
      </fieldset>
      <Button className={styles.button} type="submit">
        Edit User
      </Button>
    </form>
  );
};
