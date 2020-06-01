import React from 'react';

import { render, fireEvent } from '@testing-library/react';

import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import CompanyMenu from './organisation-menu.component';
import { CORPORATE_ACCOUNT, LICENCE_DASHBOARD } from './admin.component';

describe('Admin organisation Menu Component', () => {
  let history = null;
  let setVisiblePanel = null;
  beforeEach(() => {
    history = createMemoryHistory({ initialEntries: ['/'] });
    setVisiblePanel = jest.fn();
  });

  it('should render the admin organisation menu', () => {
    const { getByText } = render(
      <Router history={history}>
        <CompanyMenu setVisiblePanel={setVisiblePanel} />
      </Router>,
    );

    expect(getByText('Assign Users')).toBeInTheDocument();
    expect(getByText('ALL ORBS')).toBeInTheDocument();
  });

  it('should switch content panel view to corporate account when logo is clicked', () => {
    const { getByText, getByTestId } = render(
      <Router history={history}>
        <CompanyMenu setVisiblePanel={setVisiblePanel} />
      </Router>,
    );

    fireEvent.click(getByTestId('organization-info-container'));
    expect(setVisiblePanel).toHaveBeenCalledWith(CORPORATE_ACCOUNT);
  });

  it('should switch content panel view to licence dashboard when "Assign Users" button is clicked', () => {
    const { getByText } = render(
      <Router history={history}>
        <CompanyMenu setVisiblePanel={setVisiblePanel} />
      </Router>,
    );

    fireEvent.click(getByText('Assign Users'));
    expect(setVisiblePanel).toHaveBeenCalledWith(LICENCE_DASHBOARD);
  });
});
