import React from 'react';

import { Button, Checkbox, Textfield } from '@astrosat/astrosat-ui';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { FieldError } from 'components/field-error/field-error.component';
import { FIELD_NAMES, uniqueEmail } from 'utils/validators';

import formStyles from 'forms.module.css';
import styles from './create-user-form.module.css';

const validationSchema = yup.object({
  [FIELD_NAMES.email]: uniqueEmail,
  [FIELD_NAMES.name]: yup.string(),
});

/**
 * @param {{licenceInformation?: {
 *            [key: string]: {
 *              purchased: number,
 *              available: number,
 *              active: number,
 *              pending: number
 *            }
 *          },
 *          existingEmails: string[],
 *          onSubmit({
 *            name: string,
 *            email: string,
 *            licences: string[]
 *          }): void
 *        }} props
 */
export const CreateUserForm = ({
  licenceInformation,
  existingEmails = [],
  onSubmit,
}) => {
  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(validationSchema),
    context: { existingEmails },
  });

  const createUser = data => {
    const values = {
      ...data,
      licences: data.licences
        ? Array.isArray(data.licences)
          ? data.licences
          : [data.licences]
        : [],
    };

    onSubmit(values);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(createUser)}>
      <div className={formStyles.row}>
        <label className={formStyles.hiddenLabel} htmlFor={FIELD_NAMES.name}>
          Name
        </label>
        <Textfield
          ref={register}
          name={FIELD_NAMES.name}
          id={FIELD_NAMES.name}
          placeholder="Name"
        />
        {errors[FIELD_NAMES.name] && (
          <FieldError message={errors?.[FIELD_NAMES.name].message} />
        )}
      </div>
      <div className={`${formStyles.row} ${errors.email && styles.error}`}>
        <label className={formStyles.hiddenLabel} htmlFor={FIELD_NAMES.email}>
          Email
        </label>
        <div className={styles.field}>
          <Textfield
            ref={register}
            name={FIELD_NAMES.email}
            id={FIELD_NAMES.email}
            placeholder="Email"
          />
          {errors[FIELD_NAMES.email] && (
            <FieldError message={errors?.[FIELD_NAMES.email].message} />
          )}
        </div>
      </div>
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Licences</legend>
        <div className={styles.licences}>
          {licenceInformation && Object.keys(licenceInformation)?.length ? (
            Object.keys(licenceInformation).map(orb => (
              <Checkbox
                id={orb}
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
        Create User
      </Button>
    </form>
  );
};
