import React from 'react';
import { useForm } from 'react-hook-form';
import { Button, Checkbox, Textfield } from '@astrosat/astrosat-ui';
import styles from './create-user-form.module.css';
import formStyles from 'forms.module.css';
import { createUserFormValidator } from './create-user-form.validator';

/**
 * @param {{licences?: {
 *            orb: string,
 *            available: boolean
 *          }[],
 *          existingEmails: string[],
 *          onSubmit({name: string, email: string, licences: string[]}): void
 *        }} props
 */
export const CreateUserForm = ({ licences, existingEmails, onSubmit }) => {
  const { register, handleSubmit, errors } = useForm({
    validationResolver: createUserFormValidator,
    validationContext: { existingEmails },
  });

  return (
    <form className={styles.form} onSubmit={handleSubmit(v => onSubmit && onSubmit(v))}>
      <div className={formStyles.row}>
        <label className={formStyles.hiddenLabel} htmlFor="name">
          Name
        </label>
        <Textfield ref={register} name="name" id="name" placeholder="Name" />
      </div>
      <div className={`${formStyles.row} ${errors.email && styles.error}`}>
        <label className={formStyles.hiddenLabel} htmlFor="email">
          Email
        </label>
        <div className={styles.field}>
          <Textfield ref={register} name="email" id="email" placeholder="Email" />
          <p className={styles.errorMessage}>{errors.email}</p>
        </div>
      </div>
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Licences</legend>
        <div className={styles.licences}>
          {licences?.length ? (
            licences.map(licence => (
              <Checkbox
                className={styles.licence}
                key={licence.orb}
                label={licence.orb}
                ref={register}
                name="licences"
                value={licence.orb}
                disabled={!licence.available}
              />
            ))
          ) : (
            <p className={styles.noLicencesText}>No Licences Available</p>
          )}
        </div>
      </fieldset>
      <Button className={styles.button} type="submit">
        Create User
      </Button>
    </form>
  );
};
