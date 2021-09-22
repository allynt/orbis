import React from 'react';

import { Typography } from '@astrosat/astrosat-ui';

const paragraphs = [
  'ORDER FORM - <orbName>',
  'This Order Form ("Order Form") is between STEVENSON ASTROSAT LIMITED a company incorporated in Scotland (Number SC423073) and whose Registered Office is at Copernicus Kirk, 200 High Street, Musselburgh EH21 7DX and you, (“the Customer”) and relates to our Terms and Conditions which you have accepted (the "Agreement")',
  'This is a Click to Agree Contract from within the Orbis Software if the Customer wishes to be bound by this Order Form, the Customer must click to accept this Order Form. If the Customer does not agree to be bound by this Order Form, the Customer cannot order or use any Subscription Services or any Professional Services. The Customer must be at least 18 years old to order Subscription Services.',
  'The parties hereby agree as follows:',
  '1. Order Form. This document constitutes an "Order Form" under the Agreement, and this Order Form and the Subscription Services and Professional Services contemplated herein are subject to the terms and provisions of the Agreement.',
  '2. In this Order Form, unless specified otherwise, words and phrases shall have the same meanings as those in the Agreement.',
  'Subscription Services',
  '1.Number of Users: <numUsers> licenses that give access to the Orbis platform distributable at the discretion of the Customer.',
  '2. Fees: These Services are being provided free of charge for the duration of the Trial Term after which the amount of £0.0 will become due for the duration of the Subscription Term.',
  '3. Cancellation: The Customer may cancel their access to the <orbName> at any time during a Subscription Term and the Customer will maintain its unrestricted access to the Service until the end day of the Subscription Term.',
  '4. Services: Access to the data and functionality contained within the <orbName>',
  '5. Orb: A defined collection of data and functionality',
  '6. Subscription Term: Access to the Orbis platform until the end of Trial Term',
];

const getParagraph = (template, vars) => {
  let text = template;
  vars.forEach(tag => {
    const lookup = `<${tag.name}>`;
    if (text.includes(lookup)) {
      text = text.replace(lookup, tag.value);
    }
  });

  return text;
};

export const orderText = (orbName, users) =>
  paragraphs.map((paragraph, i) => {
    const paragraphText = getParagraph(paragraph, [
      {
        name: 'orbName',
        value: orbName,
      },
      {
        name: 'numUsers',
        value: users,
      },
    ]);

    return (
      // eslint-disable-next-line react/no-array-index-key
      <Typography key={i} style={{ fontSize: 'inherit' }} paragraph>
        {paragraphText}
      </Typography>
    );
  });
