import React, { useState } from 'react';

import { Button, Radio } from '@astrosat/astrosat-ui';

import { useHistory } from 'react-router-dom';

import { TERMS } from 'legal-documents/legal-documents-constants';
import { REGISTER_CUSTOMER_USER, REGISTER } from 'accounts/accounts.constants';

import formStyles from 'forms.module.css';
import styles from './journey-selection.module.css';

const SMALL_PRINT = (
  <>
    A contract will be created between Astrosat and You "The Customer”. Before
    you proceed, you need to accept our Terms and Conditions and our Privacy
    Policy both of which can be found{' '}
    <Button
      className={styles.link}
      href={TERMS}
      target="_blank"
      rel="noreferrer noopener"
    >
      here
    </Button>
    , we will then verify your email address [by sending you a verification
    email to which you must reply], you can then proceed to create your company
    profile and order Subscription Services and Professional Services. We will
    send you an Order Form showing what you have ordered with relevant pricing
    and any other relevant information. No contract will be created between
    Astrosat and the Customer until you have checked and accepted the Order
    Form. If the order form is incorrect, you must get in touch with us as soon
    as possible and no later than 14 days
  </>
);

/**
 * @param {{
 *  individualRegistrationIsOpen?: boolean
 *  customerRegistrationIsOpen?: boolean
 * }} props
 */
const JourneySelection = ({
  individualRegistrationIsOpen = true,
  customerRegistrationIsOpen = true,
}) => {
  /** @type {['customer'|'individual', React.Dispatch<'customer'|'individual'>]} */
  const [selection, setSelection] = useState();
  const history = useHistory();

  /**
   * @param {'customer' | 'individual'} value
   */
  const handleChange = value => () => {
    setSelection(value);
  };

  const handleClick = () => {
    switch (selection) {
      case 'customer':
        history.push(REGISTER_CUSTOMER_USER);
        break;
      case 'individual':
        history.push(REGISTER);
        break;
      default:
        break;
    }
  };

  return (
    <div className={formStyles.form}>
      <h1 className={styles.heading}>Welcome to Orbis</h1>
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Sign Up as:</legend>
        <div className={styles.radios}>
          <Radio
            className={styles.radio}
            id="customer"
            label="Team"
            name="journey"
            value="customer"
            onChange={handleChange('customer')}
            disabled={!customerRegistrationIsOpen}
          />
          <Radio
            className={styles.radio}
            id="individual"
            label="Individual"
            name="journey"
            value="individual"
            onChange={handleChange('individual')}
            disabled={!individualRegistrationIsOpen}
          />
        </div>
      </fieldset>
      <p className={styles.smallPrint}>{SMALL_PRINT}</p>
      <div className={formStyles.buttons}>
        <Button onClick={handleClick} disabled={!selection}>
          Continue
        </Button>
      </div>
    </div>
  );
};

export default JourneySelection;
