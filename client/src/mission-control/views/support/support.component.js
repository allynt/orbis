import React from 'react';

import {
  Link,
  makeStyles,
  Paper,
  SvgIcon,
  Typography,
} from '@astrosat/astrosat-ui';

import apiClient from 'api-client';
import ContentWrapper from 'mission-control/content-wrapper.component';

import { ReactComponent as AssistanceIcon } from './assistance.svg';
import { ReactComponent as PdfIcon } from './pdf.svg';

const useStyles = makeStyles(theme => ({
  wrapper: {
    [theme.breakpoints.up('sm')]: {
      display: 'flex',
    },
  },
  paper: {
    width: '100%',
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(5),
    textAlign: 'center',
    maxWidth: '425px',
    marginLeft: 'auto',
    marginRight: 'auto',
    '& + &': {
      marginTop: theme.spacing(3),
    },
    [theme.breakpoints.up('sm')]: {
      '&:first-of-type': {
        marginRight: 0,
      },
      '& + &': {
        marginTop: 0,
        marginLeft: theme.spacing(3),
      },
    },
    '& p': {
      fontStyle: 'italic',
    },
  },
  icon: {
    fontSize: theme.typography.pxToRem(50),
    marginBottom: theme.spacing(3),
  },
}));

const Item = ({ title, children, icon }) => {
  const styles = useStyles();

  return (
    <Paper className={styles.paper}>
      <SvgIcon className={styles.icon}>{icon}</SvgIcon>
      <Typography variant="h2" gutterBottom>
        {title}
      </Typography>
      <Typography>{children}</Typography>
    </Paper>
  );
};

export const Support = () => {
  const styles = useStyles();
  return (
    <ContentWrapper title="Support">
      <div className={styles.wrapper}>
        <Item title="Need Assistance?" icon={<AssistanceIcon />}>
          If you have any questions you can submit a ticket{' '}
          <Link
            href="https://share.hsforms.com/1U1g8jQnFQ2ej1lyaDcncfA4cctf"
            rel="noopener noreferrer"
            target="_blank"
          >
            here
          </Link>
          . We will make sure to answer as soon as possible.
        </Item>
        <Item title="User Guide" icon={<PdfIcon />}>
          Follow our guide to start your journey with Orbis,{' '}
          <Link
            href={apiClient.documents.userGuideUrl()}
            rel="noopener noreferrer"
            target="_blank"
          >
            view and download here
          </Link>
          , then check out our samples to add your first orb and analyse your
          data.
        </Item>
      </div>
    </ContentWrapper>
  );
};
