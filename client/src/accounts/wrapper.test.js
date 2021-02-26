import React from 'react';
import { render } from '@testing-library/react';
import Wrapper from './wrapper.component';

describe('<Wrapper />', () => {
  it('Shows children', () => {
    const { getByText } = render(<Wrapper>Hello</Wrapper>);
    expect(getByText('Hello')).toBeInTheDocument();
  });
});
