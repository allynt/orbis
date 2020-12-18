import * as React from 'react';
import { render } from '@testing-library/react';
import { MoreInformation } from './more-information.component';

describe('<MoreInformation />', () => {
  it('Shows the details of the property', () => {
    const { getByText } = render(<MoreInformation details="Hello" />);
    expect(getByText('Hello')).toBeInTheDocument();
  });

  it('Shows the source of the property', () => {
    const { getByText } = render(<MoreInformation source="Hello" />);
    expect(getByText('Hello')).toBeInTheDocument();
  });
});
