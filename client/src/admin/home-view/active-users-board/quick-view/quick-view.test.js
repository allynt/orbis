import React from 'react';
import { render } from '@testing-library/react';
import QuickView from './quick-view.component';

const licenceData = {
  active: 1,
  pending: 2,
  available: 3,
};

describe('QuickView', () => {
  it('should display the licence data in the QuickView', () => {
    const { getByText } = render(<QuickView licenceData={licenceData} />);

    expect(getByText('Active Users')).toBeInTheDocument();
    expect(getByText(`${licenceData.active}`)).toBeInTheDocument();
    expect(getByText('Pending Invitations')).toBeInTheDocument();
    expect(getByText(`${licenceData.pending}`)).toBeInTheDocument();
    expect(getByText('Licences Available')).toBeInTheDocument();
    expect(getByText(`${licenceData.available}`)).toBeInTheDocument();
  });

  it('should show defaults if no data is present', () => {
    const { getAllByText } = render(<QuickView licenceData={null} />);

    expect(getAllByText('-')[0]).toBeInTheDocument();
    expect(getAllByText('-')[1]).toBeInTheDocument();
    expect(getAllByText('-')[2]).toBeInTheDocument();
  });
});
