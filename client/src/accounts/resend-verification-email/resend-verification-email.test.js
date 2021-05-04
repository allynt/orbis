import React from 'react';
import { render } from '@testing-library/react';
import { default as ResendVerificationEmail } from './resend-verification-email.component';
import userEvent from '@testing-library/user-event';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

const wrapper = ({ children }) => (
  <Router history={createMemoryHistory()}>{children}</Router>
);

describe('<ResendVerificationEmail />', () => {
  it("displays the user's email", () => {
    const email = 'test@test.com';
    const { getByText } = render(<ResendVerificationEmail email={email} />, {
      wrapper,
    });
    expect(getByText(email)).toBeInTheDocument();
  });

  it('calls onResend when the resend button is clicked', () => {
    const onResend = jest.fn();
    const { getByRole } = render(
      <ResendVerificationEmail onResend={onResend} />,
      { wrapper },
    );
    userEvent.click(getByRole('button', { name: /resend\semail/i }));
    expect(onResend).toBeCalled();
  });

  it('shows a spinner if loading', () => {
    const { getByRole } = render(<ResendVerificationEmail isLoading />, {
      wrapper,
    });
    expect(getByRole('progressbar')).toBeInTheDocument();
  });
});
