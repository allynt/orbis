import React, { useState } from 'react';

import {
  Button,
  Checkbox,
  FormControlLabel,
  Link,
  makeStyles,
  Paper,
  Typography,
  Well,
} from '@astrosat/astrosat-ui';

import { PlayArrow } from '@material-ui/icons';
import { find } from 'lodash';

import { LoadingButton } from 'components';
import { TextField } from 'mission-control/shared-components/text-field.component';

import { Wrapper } from '../../../shared-components/wrapper.component';
import { orderText } from './order-text';

const useStyles = makeStyles(theme => ({
  wrapper: {
    display: 'grid',
    justifyItems: 'center',
  },
  headingWrapper: {
    display: 'flex',
    width: '100%',
  },
  icon: { transform: 'rotate(180deg)' },
  title: {
    fontWeight: 600,
    fontSize: '2rem',
    width: 'fit-content',
    margin: theme.spacing(0, 'auto', 5),
    borderBottom: `1px solid ${theme.palette.primary.main}`,
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
 *  history: import('history').History
 * }} props
 */
export const Checkout = ({
  orbs,
  location,
  errors,
  isLoading = false,
  onConfirmClick,
  history,
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
    <Wrapper className={styles.wrapper}>
      <div className={styles.headingWrapper}>
        <Button
          // @ts-ignore
          role="link"
          classes={{ startIcon: styles.icon }}
          startIcon={<PlayArrow />}
          variant="text"
          size="small"
          color="default"
          onClick={() => history.goBack()}
        >
          Back
        </Button>
        <Typography className={styles.title} variant="h1">
          Your Order
        </Typography>
      </div>
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
      <Paper className={styles.orderTerms}>{orderText(orb.name, users)}</Paper>
      <FormControlLabel
        className={styles.checkbox}
        label={<>I accept the Order Form</>}
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
