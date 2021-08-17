import React from 'react';

import { render } from '@testing-library/react';

import QuickView from './quick-view.component';

describe('QuickView', () => {
  it('should display the licence data in the QuickView', () => {
    const { getByText } = render(
      <QuickView activeUsers={1} pendingUsers={2} />,
    );

    expect(getByText('Active Users')).toBeInTheDocument();
    expect(getByText('1')).toBeInTheDocument();
    expect(getByText('Pending Invitations')).toBeInTheDocument();
    expect(getByText('2')).toBeInTheDocument();
  });

  it('should show defaults if no data is present', () => {
    const { getAllByText } = render(<QuickView />);

    expect(getAllByText('-')[0]).toBeInTheDocument();
    expect(getAllByText('-')[1]).toBeInTheDocument();
  });

  it('should show defaults if only some data is present', () => {
    const { getByText, getAllByText } = render(<QuickView activeUsers={1} />);

    expect(getByText('1')).toBeInTheDocument();
    expect(getAllByText('-')[0]).toBeInTheDocument();
  });
});
