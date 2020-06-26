import React from 'react';

import { render, fireEvent } from '@testing-library/react';

import OrganisationMenu from './organisation-menu.component';
import { ADMIN_VIEW } from '../admin.constants';

describe('Admin organisation Menu Component', () => {
  let setVisiblePanel = null;
  let selectedCustomer = null;
  beforeEach(() => {
    setVisiblePanel = jest.fn();
    selectedCustomer = {
      title: 'Cyberdyne Systems',
      logo: 'https://ichef.bbci.co.uk/images/ic/1200x675/p03t1sm8.jpg',
    };
  });

  it('should render the admin organisation menu', () => {
    const { getByText, getByAltText } = render(
      <OrganisationMenu customer={selectedCustomer} setVisiblePanel={setVisiblePanel} />,
    );

    expect(getByText(selectedCustomer.title)).toBeInTheDocument();
    expect(getByAltText('Organisation Logo')).toBeInTheDocument();
  });

  it('should switch content panel view to corporate account when customer logo is clicked', () => {
    const { getByAltText } = render(<OrganisationMenu customer={selectedCustomer} setVisiblePanel={setVisiblePanel} />);

    fireEvent.click(getByAltText('Organisation Logo'));
    expect(setVisiblePanel).toHaveBeenCalledWith(ADMIN_VIEW.corporateAccount);
  });

  it('should switch content panel view to corporate account when customer name is clicked', () => {
    const { getByText } = render(<OrganisationMenu customer={selectedCustomer} setVisiblePanel={setVisiblePanel} />);

    fireEvent.click(getByText(selectedCustomer.title));
    expect(setVisiblePanel).toHaveBeenCalledWith(ADMIN_VIEW.corporateAccount);
  });

  it('shows the "Create User" button', () => {
    const { getByText } = render(<OrganisationMenu />);
    expect(getByText('Create User')).toBeInTheDocument();
  });
});
