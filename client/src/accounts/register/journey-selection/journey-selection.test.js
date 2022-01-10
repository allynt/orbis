import React from 'react';

import { REGISTER_CUSTOMER_USER, REGISTER } from 'accounts/accounts.constants';
import { render, screen, userEvent } from 'test/test-utils';

import JourneySelection from './journey-selection.component';

const TEAM_REGEX = /team/i;
const INDIVIDUAL_REGEX = /individual/i;
const CONTINUE_REGEX = /continue/i;

describe('<JourneySelection />', () => {
  it('displays a radio for Team', () => {
    render(<JourneySelection />);

    expect(screen.getByRole('radio', { name: TEAM_REGEX })).toBeInTheDocument();
  });

  it('displays a radio for Individual', () => {
    render(<JourneySelection />);

    expect(
      screen.getByRole('radio', { name: INDIVIDUAL_REGEX }),
    ).toBeInTheDocument();
  });

  it('disables the Team radio when team registration is not open', () => {
    render(<JourneySelection customerRegistrationIsOpen={false} />);

    expect(screen.getByRole('radio', { name: TEAM_REGEX })).toBeDisabled();
  });

  it('disables the Individual radio when individual registration is not open', () => {
    render(<JourneySelection individualRegistrationIsOpen={false} />);

    expect(
      screen.getByRole('radio', { name: INDIVIDUAL_REGEX }),
    ).toBeDisabled();
  });

  it('disables the Continue button when no selection has been made', () => {
    render(<JourneySelection />);

    expect(screen.getByRole('button', { name: CONTINUE_REGEX })).toBeDisabled();
  });

  it('enables the Continue button when a selection is made', () => {
    render(<JourneySelection />);

    expect(screen.getByRole('button', { name: CONTINUE_REGEX })).toBeDisabled();

    userEvent.click(screen.getByRole('radio', { name: TEAM_REGEX }));

    expect(screen.getByRole('button', { name: CONTINUE_REGEX })).toBeEnabled();
  });

  it('navigates to individual registration when the selection is Individual and Continue is clicked', () => {
    const { history } = render(<JourneySelection />);

    userEvent.click(screen.getByRole('radio', { name: INDIVIDUAL_REGEX }));
    userEvent.click(screen.getByRole('button', { name: CONTINUE_REGEX }));

    expect(history.location.pathname).toBe(REGISTER);
  });

  it('navigates to customer registration when Team is selected and Continue is clicked', () => {
    const { history } = render(<JourneySelection />);

    userEvent.click(screen.getByRole('radio', { name: TEAM_REGEX }));
    userEvent.click(screen.getByRole('button', { name: CONTINUE_REGEX }));

    expect(history.location.pathname).toBe(
      `/accounts${REGISTER_CUSTOMER_USER}`,
    );
  });

  it('Has a terms and conditions link', () => {
    render(<JourneySelection />);
    expect(
      screen.getByRole('link', { name: /Terms and Conditions/i }),
    ).toHaveAttribute('href', expect.stringContaining('TERMS'));
  });

  it('Has a privacy link', () => {
    render(<JourneySelection />);

    expect(
      screen.getByRole('link', { name: /Privacy Policy/i }),
    ).toHaveAttribute('href', expect.stringContaining('PRIVACY'));
  });

  it('Shows an error if neither registration is open', () => {
    render(
      <JourneySelection
        individualRegistrationIsOpen={false}
        customerRegistrationIsOpen={false}
      />,
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});
