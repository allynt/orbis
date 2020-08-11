import React from 'react';
import { render } from '@testing-library/react';
import QuickView from './quick-view.component';

const quickViewData = {
  active: 1,
  pending: 2,
  available: 3,
};

describe('QuickView', () => {
  it('should display the licence data in the QuickView', () => {
    const { getByText } = render(<QuickView quickViewData={quickViewData} />);

    expect(getByText('Active Users')).toBeInTheDocument();
    expect(getByText(`${quickViewData.active}`)).toBeInTheDocument();
    expect(getByText('Pending Invitations')).toBeInTheDocument();
    expect(getByText(`${quickViewData.pending}`)).toBeInTheDocument();
    expect(getByText('Licences Available')).toBeInTheDocument();
    expect(getByText(`${quickViewData.available}`)).toBeInTheDocument();
  });

  it('should show defaults if no data is present', () => {
    const { getAllByText } = render(<QuickView quickViewData={null} />);

    expect(getAllByText('-')[0]).toBeInTheDocument();
    expect(getAllByText('-')[1]).toBeInTheDocument();
    expect(getAllByText('-')[2]).toBeInTheDocument();
  });

  it('should show defaults if only some data is present', () => {
    const { getByText, getAllByText } = render(
      <QuickView
        quickViewData={{
          active: 1,
          pending: undefined,
          available: null,
        }}
      />,
    );

    expect(getByText('1')).toBeInTheDocument();
    expect(getAllByText('-')[0]).toBeInTheDocument();
    expect(getAllByText('-')[1]).toBeInTheDocument();
  });
});
