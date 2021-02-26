//@ts-nocheck
import React from 'react';

import { render, waitFor } from '@testing-library/react';

import UpdateUserForm from './update-user-form.component';
import userEvent from '@testing-library/user-event';

const renderComponent = (user = {}) => {
  const updateUser = jest.fn();
  const utils = render(<UpdateUserForm user={user} updateUser={updateUser} />);
  return { updateUser, ...utils };
};

describe('Update User Form Component', () => {
  it('Shows the user email if provided', () => {
    const email = 'test@test.com';
    const { getByRole } = renderComponent({ email });
    expect(getByRole('textbox', { name: /email/i })).toHaveValue(email);
  });

  it('Shows the user name if provided', () => {
    const name = 'Test name';
    const { getByRole } = renderComponent({ name });
    expect(getByRole('textbox', { name: /name/i })).toHaveValue(name);
  });

  it('calls updateUser with updated values when submitted', async () => {
    const name = 'John Smith';
    const { getByRole, updateUser } = renderComponent();
    userEvent.type(getByRole('textbox', { name: /name/i }), name);
    userEvent.click(getByRole('button'));
    await waitFor(() =>
      expect(updateUser).toHaveBeenCalledWith(
        expect.objectContaining({ name }),
      ),
    );
  });
});
