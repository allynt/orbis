import React, { useState } from 'react';

import {
  Button,
  Checkbox,
  FormControlLabel,
  makeStyles,
  Paper,
  TextField,
  Typography,
} from '@astrosat/astrosat-ui';

import { find } from 'lodash';

import { Heading } from '../orbs/heading.component';
import { Wrapper } from '../orbs/wrapper.component';
import { orderText } from './order-text';

const useStyles = makeStyles(theme => ({
  wrapper: {
    display: 'grid',
    justifyItems: 'center',
  },
  textField: {
    backgroundColor: theme.palette.background.default,
    borderRadius: theme.shape.borderRadius,
    marginBottom: theme.spacing(2),
    '&:last-of-type': {
      marginBottom: theme.spacing(4),
    },
  },
  label: {
    padding: theme.spacing(1, 2),
  },
  orderTerms: {
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
    maxHeight: '15rem',
    overflowY: 'auto',
    fontSize: theme.typography.pxToRem(10),
  },
  checkbox: {
    marginBottom: theme.spacing(3),
  },
}));

/**
 * @param {{
 *  orbs: import('typings').Orb[]
 *  match: import('react-router-dom').match<{orbId: number, users: number}>
 * }} props
 */
export const Checkout = ({ orbs, match }) => {
  const styles = useStyles();
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const { users, orbId } = match.params;
  const orb = find(orbs, { id: orbId });

  return (
    <Wrapper className={styles.wrapper} maxWidth={false}>
      <Heading>Your Order</Heading>
      <Typography variant="h3" component="p" paragraph>
        Please read the Terms & Conditions and if everything checks out accept
        the terms and confirm your order.
      </Typography>
      <TextField
        className={styles.textField}
        InputLabelProps={{ className: styles.label }}
        id="orbName"
        label="Name of the product"
        InputProps={{ readOnly: true }}
        value={orb.name}
      />
      <TextField
        className={styles.textField}
        InputLabelProps={{ className: styles.label }}
        id="licenceCost"
        label="Licence"
        InputProps={{ readOnly: true }}
        value={orb.licence_cost <= 0 ? 'Free' : orb.licence_cost}
      />
      <TextField
        className={styles.textField}
        InputLabelProps={{ className: styles.label }}
        id="numberOfUsers"
        label="The number of users you need"
        InputProps={{ readOnly: true }}
        value={users}
      />
      <Paper className={styles.orderTerms}>{orderText}</Paper>
      <FormControlLabel
        className={styles.checkbox}
        label="I agree with the Terms & Conditions"
        value={acceptedTerms}
        onChange={(_, checked) => setAcceptedTerms(checked)}
        control={<Checkbox />}
      />
      <Button disabled={!acceptedTerms}>Confirm</Button>
    </Wrapper>
  );
};
