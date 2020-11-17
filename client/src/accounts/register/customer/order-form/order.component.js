import * as React from 'react';

import { styled, Typography } from '@astrosat/astrosat-ui';

const P = ({ children }) => (
  <Typography style={{ fontSize: 'inherit' }} paragraph>
    {children}
  </Typography>
);

const Ol = ({ children }) => (
  <Typography component="ol" style={{ fontSize: 'inherit' }}>
    {children}
  </Typography>
);

const LiBase = styled('li')({
  fontSize: 'inherit',
  listStyle: 'decimal',
  marginLeft: '1em',
  '&:last-of-type': {
    marginBottom: '1em',
  },
});

const Li = ({ children }) => (
  <Typography component={LiBase}>{children}</Typography>
);

const H1 = styled(Typography)({
  fontWeight: 600,
  fontSize: '1.5em',
  textDecoration: 'underline',
});

const Order = () => (
  <>
    <P>
      This Order Form (&quot;Order Form&quot;) is between{' '}
      <b>STEVENSON ASTROSAT LIMITED</b> a company incorporated in Scotland
      (Number SC423073) and whose Registered Office is at Copernicus Kirk, 200
      High Street, Musselburgh EH21 7DX and you, (
      <b>&quot;the Customer&quot;</b>) and relates to our Terms and Conditions
      which you have accepted (<b>the &quot;Agreement&quot;</b>)
    </P>
    <P>
      This is a Click to Agree Contract from within the Orbis Software if the
      Customer wishes to be bound by this Order Form, the Customer must click to
      accept this Order Form. If the Customer does not agree to be bound by this
      Order Form, the Customer cannot order or use any Subscription Services or
      any Professional Services. The Customer must be at least 18 years old to
      order Subscription Services.
    </P>
    <Ol>
      The parties hereby agree as follows:
      <Li>
        Order Form. This document constitutes an &quot;Order Form&quot; under
        the Agreement, and this Order Form and the Subscription Services and
        Professional Services contemplated herein are subject to the terms and
        provisions of the Agreement.
      </Li>
      <Li>
        In this Order Form, unless specified otherwise, words and phrases shall
        have the same meanings as those in the Agreement.
      </Li>
    </Ol>
    <H1 variant="h1" gutterBottom>
      Subscription Services
    </H1>
    <Ol>
      <Li>
        Number of Users: 10 licenses that give access to the Orbis platform
        distributable at the discretion of the Customer.
      </Li>
      <Li>
        Fees: These Services are being offered for free within the Subscription
        Term with costs subsidised by Astrosat and the European Space Agency.
      </Li>
      <Li>
        Subscription Term: Access to the Orbis platform until the 30th April
        2021
      </Li>
    </Ol>
  </>
);

export default Order;
