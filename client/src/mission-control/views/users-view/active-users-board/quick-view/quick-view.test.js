import React from 'react';

import { render } from '@testing-library/react';

import QuickView from './quick-view.component';

const data = {
  active: 1,
  pending: 2,
};

describe('QuickView', () => {
  it('should display the licence data in the QuickView', () => {
    const { getByText } = render(<QuickView data={data} />);

    expect(getByText('Active Users')).toBeInTheDocument();
    expect(getByText(`${data.active}`)).toBeInTheDocument();
    expect(getByText('Pending Invitations')).toBeInTheDocument();
    expect(getByText(`${data.pending}`)).toBeInTheDocument();
  });

  it('should show defaults if no data is present', () => {
    const { getAllByText } = render(<QuickView data={null} />);

    expect(getAllByText('-')[0]).toBeInTheDocument();
    expect(getAllByText('-')[1]).toBeInTheDocument();
  });

  it('should show defaults if only some data is present', () => {
    const { getByText, getAllByText } = render(
      <QuickView
        data={{
          active: 1,
          pending: undefined,
          available: null,
        }}
      />,
    );

    expect(getByText('1')).toBeInTheDocument();
    expect(getAllByText('-')[0]).toBeInTheDocument();
  });
});
