import React from 'react';

import { render, fireEvent } from '@testing-library/react';

import OrganisationMenu from './organisation-menu.component';
import { CORPORATE_ACCOUNT } from './admin.component';

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
      <OrganisationMenu selectedCustomer={selectedCustomer} setVisiblePanel={setVisiblePanel} />,
    );

    expect(getByText(selectedCustomer.title)).toBeInTheDocument();
    expect(getByAltText('Organisation Logo')).toBeInTheDocument();
  });

  it('should switch content panel view to corporate account when logo is clicked', () => {
    const { getByAltText } = render(
      <OrganisationMenu selectedCustomer={selectedCustomer} setVisiblePanel={setVisiblePanel} />,
    );

    fireEvent.click(getByAltText('Organisation Logo'));
    expect(setVisiblePanel).toHaveBeenCalledWith(CORPORATE_ACCOUNT);
  });
});
