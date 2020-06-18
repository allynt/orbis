import React from 'react';

import { useForm, Button, Textfield, Checkbox } from '@astrosat/astrosat-ui';

import validate from './corporate-account.validator';

import styles from './corporate-account.module.css';

const CorporateAccount = ({ customer }) => {
  const { handleChange, handleSubmit, values, errors } = useForm(onSubmit, validate);

  function onSubmit() {
    console.log('Submit!');
  }

  return (
    <form className={styles.corporateAccount} onSubmit={handleSubmit}>
      <div className={styles.logoContainer}>
        <img src={customer.logo} className={styles.logo} alt="Organisation Logo" />
        <Button theme="link" onClick={() => console.log('Upload new image!')}>
          Upload new image
        </Button>
        <Button theme="link" onClick={() => console.log('Remove!')}>
          Remove
        </Button>
      </div>

      <div className={styles.nameFields}>
        <h2>Name: </h2>
        <Textfield name="name" value={values.name || ''} placeholder="Name" onChange={handleChange} />
      </div>
    </form>
  );
};

export default CorporateAccount;
