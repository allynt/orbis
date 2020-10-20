import React from 'react';
import clsx from 'clsx';
import { Textfield } from '@astrosat/astrosat-ui';
import { FieldError } from 'components/field-error/field-error.component';
import styles from './field.module.css';

/**
 * @param {{
 *   name: string
 *   label: string
 *   Component?: React.FunctionComponent
 *   register: (ref: React.Ref<any>) => void
 *   errors?: import('react-hook-form').DeepMap<any, import('react-hook-form').FieldError>
 *   readOnly?: boolean
 *   helpText?: string
 *   autoFocus?: boolean
 * inline?: boolean
 * }} props
 */
export const Field = ({
  name,
  label,
  Component = Textfield,
  register,
  errors,
  readOnly = false,
  helpText,
  autoFocus = false,
  inline = false,
}) => (
  <div className={clsx(styles.field, { [styles.inline]: inline })}>
    <label className={styles.label} htmlFor={name}>
      {label}
    </label>
    <Component
      ref={register}
      id={name}
      name={name}
      readOnly={readOnly}
      autoFocus={autoFocus}
    />
    {helpText && <p className={styles.helpText}>{helpText}</p>}
    <FieldError message={errors?.[name]?.message} />
  </div>
);
