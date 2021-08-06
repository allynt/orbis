import React from 'react';

import { Typography } from '@astrosat/astrosat-ui';

const paragraphs = [
  `This Order Form ("Order Form") is between STEVENSON ASTROSAT LIMITED a company incorporated in Scotland (Number SC423073) and whose Registered Office is at Copernicus Kirk, 200 High Street, Musselburgh EH21 7DX and you, (“the Customer”) and relates to our Terms and Conditions which you have accepted (the "Agreement")`,
  `This is a Click to Agree Contract from within the Orbis Software if the Customer wishes to be bound by this Order Form, the Customer must click to accept this Order Form. If the Customer does not agree to be bound by this Order Form, the Customer cannot order or use any Subscription Services or any Professional Services. The Customer must be at least 18 years old to order Subscription Services.`,
  `The parties hereby agree as follows:`,
  `Order Form. This document constitutes an "Order Form" under the Agreement, and this Order Form and the Subscription Services and Professional Services contemplated herein are subject to the terms and provisions of the Agreement.`,
  `2. In this Order Form, unless specified otherwise, words and phrases shall have the same meanings as those in the Agreement.`,
];

export const orderText = paragraphs.map(paragraph => (
  // eslint-disable-next-line react/jsx-key
  <Typography style={{ fontSize: 'inherit' }} paragraph>
    {paragraph}
  </Typography>
));
