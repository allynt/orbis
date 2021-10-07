import React from 'react';

import { render, screen, userEvent } from 'test/test-utils';

import { default as ResendVerificationEmail } from './resend-verification-email.component';

describe('<ResendVerificationEmail />', () => {
  it("displays the user's email", () => {
    const email = 'test@test.com';
    render(<ResendVerificationEmail email={email} />);

    expect(screen.getByText(email)).toBeInTheDocument();
  });

  it('calls onResend when the resend button is clicked', () => {
    const onResend = jest.fn();
    render(<ResendVerificationEmail onResend={onResend} />);

    userEvent.click(screen.getByRole('button', { name: /resend\semail/i }));
    expect(onResend).toBeCalled();
  });

  it('shows a spinner if loading', () => {
    render(<ResendVerificationEmail isLoading />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});
