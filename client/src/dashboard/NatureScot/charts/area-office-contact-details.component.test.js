import React from 'react';

import { render, screen } from 'test/test-utils';

import AreaOfficeContactDetail from './area-office-contact-details.component';

describe('<AreaOfficeContactDetail />', () => {
  let contactDetails = null;
  const NO_OF_NO_DATA_FIELDS = 0;
  const NO_OF_FIELDS = 6;
  const NO_OF_MISSING_DATA = 4;
  const noDataMessage = 'No Data';

  beforeEach(() => {
    contactDetails = {
      area_office: 'Test Area Office',
      area_name: 'East Highland',
      telephone_number: '01526272666',
      area_office_address: ['test area1', 'test area2', 'test area3'],
      postcode: 'eh21 8bj',
      email: 'test@test.com',
    };
  });

  it('should render the `No Data` message', () => {
    render(<AreaOfficeContactDetail contactDetails={[]} />);
    expect(screen.getAllByText(noDataMessage).length).toBe(NO_OF_FIELDS);
  });

  it('should render all data', () => {
    render(<AreaOfficeContactDetail contactDetails={contactDetails} />);
    expect(screen.getByText(contactDetails.area_name)).toBeInTheDocument();
    expect(
      screen.getByText(contactDetails.telephone_number),
    ).toBeInTheDocument();
    expect(screen.getByText(contactDetails.postcode)).toBeInTheDocument();
    expect(screen.getByText(contactDetails.email)).toBeInTheDocument();

    contactDetails.area_office_address.forEach(address => {
      expect(screen.getByText(address)).toBeInTheDocument();
    });
    expect(screen.queryAllByText(noDataMessage).length).toBe(
      NO_OF_NO_DATA_FIELDS,
    );
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
    expect(screen.getAllByText(noDataMessage).length).toBe(NO_OF_MISSING_DATA);
    expect(screen.getByText(contactDetails.area_name)).toBeInTheDocument();
  });
});
