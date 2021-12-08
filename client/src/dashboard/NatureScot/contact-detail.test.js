import React from 'react';

import { render, screen } from 'test/test-utils';

import AreaOfficeContactDetail from './area-office-contact-details.component';

const ContactDetails = [
  {
    area_name: 'Test Area Name',
    telephone_number: '01526272666',
    area_office_address: ['test area1', 'test area2', 'test area3'],
    postcode: 'eh21 8bj',
    email: 'test@test.com',
  },
];

describe('<AreaOfficeContactDetail />', () => {
  let contactDetails = null;

  beforeEach(() => {
    contactDetails = ContactDetails;
  });

  it('should render the `No Data` message', () => {
    render(<AreaOfficeContactDetail contactDetails={[]} />);
    expect(screen.getByText('No Data')).toBeInTheDocument();
  });

  it('should render the contact detail data', () => {
    render(<AreaOfficeContactDetail contactDetails={contactDetails} />);
    expect(screen.getAllByRole('data').length).toBe(5);
  });
});
