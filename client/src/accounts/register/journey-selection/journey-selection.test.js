import React from 'react';

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

import { TERMS } from 'legal-documents/legal-documents-constants';
import { REGISTER_CUSTOMER_USER, REGISTER } from 'accounts/accounts.constants';
import JourneySelection from './journey-selection.component';

const TEAM_REGEX = /team/i;
const INDIVIDUAL_REGEX = /individual/i;
const CONTINUE_REGEX = /continue/i;

const renderComponent = (
  args = {
    individualRegistrationIsOpen: true,
    customerRegistrationIsOpen: true,
  },
) => {
  const history = createMemoryHistory();
  const utils = render(<JourneySelection {...args} />, {
    wrapper: ({ children }) => <Router history={history}>{children}</Router>,
  });
  return { ...utils, history };
};

describe('<JourneySelection />', () => {
  it('displays a radio for Team', () => {
    const { getByRole } = renderComponent();
    expect(getByRole('radio', { name: TEAM_REGEX })).toBeInTheDocument();
  });

  it('displays a radio for Individual', () => {
    const { getByRole } = renderComponent();
    expect(getByRole('radio', { name: INDIVIDUAL_REGEX })).toBeInTheDocument();
  });

  it('disables the Team radio when team registration is not open', () => {
    const { getByRole } = renderComponent({
      customerRegistrationIsOpen: false,
      individualRegistrationIsOpen: true,
    });
    expect(getByRole('radio', { name: TEAM_REGEX })).toHaveAttribute(
      'disabled',
    );
  });

  it('disables the Individual radio when individual registration is not open', () => {
    const { getByRole } = renderComponent({
      customerRegistrationIsOpen: true,
      individualRegistrationIsOpen: false,
    });
    expect(getByRole('radio', { name: INDIVIDUAL_REGEX })).toHaveAttribute(
      'disabled',
    );
  });

  it('disables the Continue button when no selection has been made', () => {
    const { getByRole } = renderComponent();
    expect(getByRole('button', { name: CONTINUE_REGEX })).toBeDisabled();
  });

  it('enables the Continue button when a selection is made', () => {
    const { getByRole } = renderComponent();
    const continueButton = getByRole('button', { name: CONTINUE_REGEX });
    expect(continueButton).toBeDisabled();
    userEvent.click(getByRole('radio', { name: TEAM_REGEX }));
    expect(continueButton).not.toBeDisabled();
  });

  it('navigates to individual registration when the selection is Individual and Continue is clicked', () => {
    const { getByRole, history } = renderComponent();
    userEvent.click(getByRole('radio', { name: INDIVIDUAL_REGEX }));
    userEvent.click(getByRole('button', { name: CONTINUE_REGEX }));
    expect(history.location.pathname).toBe(REGISTER);
  });

  it('navigates to customer registration when Team is selected and Continue is clicked', () => {
    const { getByRole, history } = renderComponent();
    userEvent.click(getByRole('radio', { name: TEAM_REGEX }));
    userEvent.click(getByRole('button', { name: CONTINUE_REGEX }));
    expect(history.location.pathname).toBe(REGISTER_CUSTOMER_USER);
  });

  it('Has a terms and conditions link', () => {
    const { getByRole } = renderComponent();
    expect(getByRole('link', { name: /here/i })).toHaveAttribute('href', TERMS);
  });
});
