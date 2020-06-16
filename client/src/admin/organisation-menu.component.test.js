import React from 'react';

import { render, fireEvent, getByAltText } from '@testing-library/react';

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
      title: 'Cyberdyne Systems',
      logo: 'https://ichef.bbci.co.uk/images/ic/1200x675/p03t1sm8.jpg',
    };
  });

  it('should render the admin organisation menu', () => {
    const { getByText, getByAltText } = render(
      <Router history={history}>
        <OrganisationMenu selectedCustomer={selectedCustomer} setVisiblePanel={setVisiblePanel} />
      </Router>,
    );

    expect(getByText(selectedCustomer.title)).toBeInTheDocument();
    expect(getByAltText('Organisation Logo')).toBeInTheDocument();
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
