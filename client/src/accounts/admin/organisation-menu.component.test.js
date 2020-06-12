import React from 'react';

import { render, fireEvent } from '@testing-library/react';

import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import OrganisationMenu from './organisation-menu.component';
import { CORPORATE_ACCOUNT, LICENCE_DASHBOARD } from './admin.component';

describe('Admin organisation Menu Component', () => {
  let history = null;
  let setVisiblePanel = null;
  let selectedCustomer = null;
  beforeEach(() => {
    history = createMemoryHistory({ initialEntries: ['/'] });
    setVisiblePanel = jest.fn();
    selectedCustomer = {
      type: 'MULTIPLE',
      name: 'cyberdyne',
      title: 'Cyberdyne Systems',
      description: 'Bringing you the future, today.',
      logo: 'https://ichef.bbci.co.uk/images/ic/1200x675/p03t1sm8.jpg',
      users: [
        {
          id: 1,
          username: 'user@test.com',
          email: 'user@test.com',
          name: null,
          description: '',
          is_verified: true,
          is_approved: true,
          profiles: {},
          roles: ['UserRole', 'AstrosatRole'],
        },
      ],
      roles: ['SaveTheWorldRole'],
      permissions: ['can_deploy_skynet'],
      data_limit: 100,
      data_total: 50,
    };
  });

  it('should render the admin organisation menu', () => {
    const { getByText } = render(
      <Router history={history}>
        <OrganisationMenu selectedCustomer={selectedCustomer} setVisiblePanel={setVisiblePanel} />
      </Router>,
    );

    expect(getByText('Assign Users')).toBeInTheDocument();
    expect(getByText('ALL ORBS')).toBeInTheDocument();
  });

  it('should switch content panel view to corporate account when logo is clicked', () => {
    const { getByTestId } = render(
      <Router history={history}>
        <OrganisationMenu selectedCustomer={selectedCustomer} setVisiblePanel={setVisiblePanel} />
      </Router>,
    );

    fireEvent.click(getByTestId('organization-info-container'));
    expect(setVisiblePanel).toHaveBeenCalledWith(CORPORATE_ACCOUNT);
  });

  it('should switch content panel view to licence dashboard when "Assign Users" button is clicked', () => {
    const { getByText } = render(
      <Router history={history}>
        <OrganisationMenu selectedCustomer={selectedCustomer} setVisiblePanel={setVisiblePanel} />
      </Router>,
    );

    fireEvent.click(getByText('Assign Users'));
    expect(setVisiblePanel).toHaveBeenCalledWith(LICENCE_DASHBOARD);
  });
});
