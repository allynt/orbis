import React from 'react';

import { render } from '@testing-library/react';

import { Details } from './details.component';

describe('<Details />', () => {
  it('Displays separate paragraphs when details is a string array', () => {
    const details = [
      'This is on line',
      'And this should be another line',
      'And this is the crazy third line',
    ];
    const { getByText } = render(<Details details={details} />);
    details.forEach(line => expect(getByText(line)).toBeInTheDocument());
  });
});
