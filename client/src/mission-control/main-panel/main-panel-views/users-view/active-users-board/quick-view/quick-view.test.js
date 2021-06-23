import React from 'react';

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import QuickView from './quick-view.component';

const testData = {
  active: 1,
  pending: 2,
  available: 3,
};

const renderComponent = ({ data = testData }) => {
  const onCreateUserClick = jest.fn();
  const utils = render(
    <QuickView data={data} onCreateUserClick={onCreateUserClick} />,
  );

  return { ...utils, onCreateUserClick };
};

describe('QuickView', () => {
  it('should display the licence data in the QuickView', () => {
    const { getByText } = renderComponent({});

    expect(getByText('Active Users')).toBeInTheDocument();
    expect(getByText(`${testData.active}`)).toBeInTheDocument();
    expect(getByText('Pending Invitations')).toBeInTheDocument();
    expect(getByText(`${testData.pending}`)).toBeInTheDocument();
    expect(getByText('Licences Available')).toBeInTheDocument();
    expect(getByText(`${testData.available}`)).toBeInTheDocument();
  });

  it('should show defaults if no data is present', () => {
    const { getAllByText } = renderComponent({ data: null });

    expect(getAllByText('-')[0]).toBeInTheDocument();
    expect(getAllByText('-')[1]).toBeInTheDocument();
    expect(getAllByText('-')[2]).toBeInTheDocument();
  });

  it('should show defaults if only some data is present', () => {
    const { getByText, getAllByText } = renderComponent({
      data: {
        active: 1,
        pending: undefined,
        available: null,
      },
    });

    expect(getByText('1')).toBeInTheDocument();
    expect(getAllByText('-')[0]).toBeInTheDocument();
    expect(getAllByText('-')[1]).toBeInTheDocument();
  });
  it('shows the "Create User" button', () => {
    const { getByText } = renderComponent({
      data: {
        active: 1,
        pending: undefined,
        available: null,
      },
    });
    expect(getByText('Create User')).toBeInTheDocument();
  });

  it('Calls the showCreateUser function when the "Create User" button is clicked', () => {
    const { getByText, onCreateUserClick } = renderComponent({});
    userEvent.click(getByText('Create User'));
    expect(onCreateUserClick).toHaveBeenCalled();
  });
});
