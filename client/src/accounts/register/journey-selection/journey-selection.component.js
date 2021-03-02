import React, { useState } from 'react';

import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Link,
  makeStyles,
  Radio,
  RadioGroup,
  Typography,
} from '@astrosat/astrosat-ui';

import { useHistory } from 'react-router-dom';

import { REGISTER_CUSTOMER_USER, REGISTER } from 'accounts/accounts.constants';
import { Form } from 'components';
import { TERMS } from 'legal-documents/legal-documents-constants';

const SMALL_PRINT = (
  <>
    A contract will be created between Astrosat and You "The Customer”. Before
    you proceed, you need to accept our Terms and Conditions and our Privacy
    Policy both of which can be found{' '}
    <Link
      variant="inherit"
      href={TERMS}
      target="_blank"
      rel="noreferrer noopener"
    >
      here
    </Link>
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

const useStyles = makeStyles(theme => ({
  legend: {
    fontWeight: 600,
    marginBottom: theme.spacing(1),
  },
  smallPrint: {
    fontSize: theme.typography.pxToRem(8),
  },
}));

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
  /** @type {[string, React.Dispatch<string>]} */
  const [selection, setSelection] = useState();
  const history = useHistory();
  const styles = useStyles();

  /**
   * @param {React.ChangeEvent<HTMLInputElement>} event
   */
  const handleChange = event => {
    setSelection(event.target.value);
  };

  const handleClick = () => {
    switch (selection) {
      case 'customer':
        history.push(REGISTER_CUSTOMER_USER);
        break;
      case 'individual':
      default:
        history.push(REGISTER);
        break;
    }
  };

  return (
    <Form>
      <Form.Row centered>
        <Typography variant="h2" component="h1">
          Welcome to Orbis
        </Typography>
      </Form.Row>
      <Form.Row>
        <FormControl component="fieldset">
          <FormLabel className={styles.legend} component="legend">
            Sign Up as:
          </FormLabel>
          <RadioGroup row name="journey" onChange={handleChange}>
            <FormControlLabel
              value="customer"
              label="Team"
              disabled={!customerRegistrationIsOpen}
              control={<Radio />}
            />
            <FormControlLabel
              value="individual"
              label="Individual"
              disabled={!individualRegistrationIsOpen}
              control={<Radio />}
            />
          </RadioGroup>
        </FormControl>
      </Form.Row>
      <Form.Row component={Typography} className={styles.smallPrint}>
        {SMALL_PRINT}
      </Form.Row>
      <Form.Row centered>
        <Button onClick={handleClick} disabled={!selection}>
          Continue
        </Button>
      </Form.Row>
    </Form>
  );
};

export default JourneySelection;
