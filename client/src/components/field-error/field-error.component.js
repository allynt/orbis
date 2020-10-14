import React from 'react';
import formStyles from '../../forms.module.css';

export const FieldError = ({ message }) => (
  <p className={formStyles.errorMessage}>{message}</p>
);
