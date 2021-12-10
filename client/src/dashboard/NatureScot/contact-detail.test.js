import React from 'react';

import { render, screen } from 'test/test-utils';

import AreaOfficeContactDetail from './area-office-contact-details.component';

const CONTACT_DETAILS = {
  area_office: 'Test Area Office',
  area_name: 'East Highland',
  telephone_number: '01526272666',
  area_office_address: ['test area1', 'test area2', 'test area3'],
  postcode: 'eh21 8bj',
  email: 'test@test.com',
};

describe('<AreaOfficeContactDetail />', () => {
  let contactDetails = null;

  beforeEach(() => {
    contactDetails = CONTACT_DETAILS;
  });

  it('should render the `No Data` message', () => {
    render(<AreaOfficeContactDetail contactDetails={[]} />);
    expect(screen.getAllByText('No Data').length).toBe(6);
  });

  it('should render all data', () => {
    render(<AreaOfficeContactDetail contactDetails={contactDetails} />);
    expect(screen.getByText(contactDetails.area_name)).toBeInTheDocument();
    expect(
      screen.getByText(contactDetails.telephone_number),
    ).toBeInTheDocument();
    expect(screen.getByText(contactDetails.postcode)).toBeInTheDocument();
    expect(screen.getByText(contactDetails.email)).toBeInTheDocument();
    expect(
      screen.getByText(contactDetails.area_office_address[0]),
    ).toBeInTheDocument();
    expect(
      screen.getByText(contactDetails.area_office_address[1]),
    ).toBeInTheDocument();
    expect(
      screen.getByText(contactDetails.area_office_address[2]),
    ).toBeInTheDocument();
  });

  it('should render some contact details data', () => {
    render(
      <AreaOfficeContactDetail
        contactDetails={{
          area_name: 'East Highland',
          telephone_number: '01526272666',
        }}
      />,
    );
    expect(screen.getAllByText('No Data').length).toBe(4);
    expect(screen.getByText(contactDetails.area_name)).toBeInTheDocument();
  });
});
