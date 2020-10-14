import React from 'react';
import { render } from '@testing-library/react';
import { default as UserRegistrationSuccess } from './user-registration-success.component';
import userEvent from '@testing-library/user-event';

describe('<UserRegistrationSuccess />', () => {
  it("displays the user's email", () => {
    const email = 'test@test.com';
    const { getByText } = render(<UserRegistrationSuccess email={email} />);
    expect(getByText(email)).toBeInTheDocument();
  });

  it('calls onResend when the resend button is clicked', () => {
    const onResend = jest.fn();
    const { getByRole } = render(
      <UserRegistrationSuccess onResend={onResend} />,
    );
    userEvent.click(getByRole('button', { name: /resend\semail/i }));
    expect(onResend).toBeCalled();
  });
});
