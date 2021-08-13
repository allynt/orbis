import React, { useState } from 'react';

import {
  Checkbox,
  FormControlLabel,
  Link,
  makeStyles,
  Paper,
  Typography,
  Well,
} from '@astrosat/astrosat-ui';

import { find } from 'lodash';

import { LoadingButton } from 'components';
import { TextField } from 'mission-control/shared-components/text-field.component';

import { Heading } from '../orbs/heading.component';
import { Wrapper } from '../orbs/wrapper.component';
import { orderText } from './order-text';

const useStyles = makeStyles(theme => ({
  wrapper: {
    display: 'grid',
    justifyItems: 'center',
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
 *  location: import('history').Location
 *  errors: string[]
 *  isLoading?: boolean
 *  onConfirmClick: (values: {orbId: import('typings').Orb['id'], users: number}) => void
 * }} props
 */
export const Checkout = ({
  orbs,
  location,
  errors,
  isLoading = false,
  onConfirmClick,
}) => {
  const styles = useStyles();
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const searchParams = new URLSearchParams(location.search);
  const users = +searchParams.get('users');
  const orbId = +searchParams.get('orbId');
  const orb = find(orbs, { id: orbId });

  const handleConfirmClick = () => {
    onConfirmClick({ orbId, users });
  };

  return (
    <Wrapper className={styles.wrapper} maxWidth={false}>
      <Heading>Your Order</Heading>
      <Typography variant="h3" component="p" paragraph>
        Please read the Terms & Conditions and if everything checks out accept
        the terms and confirm your order.
      </Typography>
      <TextField
        id="orbName"
        label="Name of the product"
        value={orb.name}
        InputProps={{ readOnly: true }}
      />
      <TextField
        id="licenceCost"
        label="Licence"
        value={orb.licence_cost <= 0 ? 'Free' : orb.licence_cost}
        InputProps={{ readOnly: true }}
      />
      <TextField
        id="numberOfUsers"
        label="The number of users you need"
        value={users}
        InputProps={{ readOnly: true }}
      />
      <Paper className={styles.orderTerms}>{orderText}</Paper>
      <FormControlLabel
        className={styles.checkbox}
        label={
          <>
            I agree with the{' '}
            <Link
              href={orb.terms_document}
              target="_blank"
              rel="noreferrer noopener"
            >
              Terms & Conditions
            </Link>
          </>
        }
        value={acceptedTerms}
        onChange={(_, checked) => setAcceptedTerms(checked)}
        control={<Checkbox />}
      />
      {errors && (
        <Well severity="error" className={styles.checkbox}>
          <Typography component="p" variant="h3" gutterBottom>
            There's been a problem
          </Typography>
          <Typography paragraph>{errors}</Typography>
          <Typography>Please try again or contact support</Typography>
        </Well>
      )}
      <LoadingButton
        disabled={!acceptedTerms}
        onClick={handleConfirmClick}
        isLoading={isLoading}
      >
        Confirm
      </LoadingButton>
    </Wrapper>
  );
};
