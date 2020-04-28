import React from 'react';
import ReactDOM from 'react-dom';

import DatePicker from 'react-datepicker';

import styles from './data-layers-filter-form.module.css';

export const DataLayersFilterForm = () => {
  return ReactDOM.createPortal(
    <div className={styles.content}>
      <div className={styles.header}>
        <h1>SELECT FILTERS: </h1>
      </div>
      <form className={styles.form}>
        <div className={styles.section}>
          <h2>Date: </h2>
          <div>
            <DatePicker name="start_date" selected={new Date()} />
            <p> to </p>
            <DatePicker name="end date" selected={new Date()} />
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <button className={styles.submitButton} type="submit">
            Add Filters
          </button>
        </div>
      </form>
    </div>,
    document.body,
  );
};
