import React from 'react';

import {
  Typography,
  Button as AuiButton,
  Link,
  Well as AuiWell,
  styled,
} from '@astrosat/astrosat-ui';

import { OrbisLogo } from 'components';

const Content = styled('div')(({ theme }) => ({
  width: '100%',
  height: '100%',
  display: 'grid',
  placeItems: 'center',
  gridTemplateRows: 'minmax(3rem, 1fr) repeat(3, min-content) 1fr',
  rowGap: theme.spacing(2),
  textAlign: 'center',
  padding: theme.spacing(2),
  overflowY: 'auto',
}));

const Logo = styled(OrbisLogo)({
  alignSelf: 'end',
  maxWidth: '10rem',
  maxHeight: '5rem',
  height: '100%',
});

const Well = styled(AuiWell)({
  width: '100%',
  maxWidth: '50rem',
  maxHeight: '20rem',
  overflow: 'auto',
});

// @ts-ignore
const Message = styled('pre')(({ theme, messageOnly }) => ({
  textAlign: 'initial',
  margin: 0,
  paddingBottom: messageOnly ? undefined : theme.spacing(2),
  whiteSpace: 'pre-wrap',
}));

const Button = styled(AuiButton)({ alignSelf: 'start' });

/**
 * @param {import('react-error-boundary').FallbackProps & {messageOnly?: boolean}} props
 */
export const MapErrorFallback = ({
  error,
  resetErrorBoundary,
  messageOnly = false,
}) => (
  <Content>
    <Logo />
    <Typography variant="h1" gutterBottom>
      Oops, something went wrong
    </Typography>
    {error && (
      <Well icon={false} severity="error" variant="filled">
        <Message
          // @ts-ignore
          messageOnly={messageOnly}
        >
          {error.stack && !messageOnly ? error.stack : error.message}
        </Message>
      </Well>
    )}
    <Typography paragraph>
      Try again or if this problem persists you can submit a support ticket{' '}
      <Link
        href="https://share.hsforms.com/1U1g8jQnFQ2ej1lyaDcncfA4cctf"
        rel="noopener noreferrer"
        target="_blank"
      >
        here
      </Link>
    </Typography>
    <Button onClick={resetErrorBoundary}>Try Again</Button>
  </Content>
);
