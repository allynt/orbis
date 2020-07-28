import { render } from '@testing-library/react';
import React from 'react';
import { Geocoder } from './geocoder.component';

describe('<Geocoder />', () => {
  it('shows the search icon', () => {
    const { getByTitle } = render(<Geocoder />);
    expect(getByTitle('Location Search')).toBeInTheDocument();
  });

  it('shows an input', () => {
    const { getByLabelText } = render(<Geocoder />);
    expect(getByLabelText('Location Search')).toBeInTheDocument();
  });

  it.todo('displays suggestions after 3 characters are typed');

  it.todo('calls the onSelect function when a result is clicked');

  it.todo('calls the onSelect function with the selected location');
});
