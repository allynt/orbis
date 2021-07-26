import React from 'react';

import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { SaveImageForm } from './save-image-form.component';

describe('<SaveImageForm />', () => {
  it('Shows an error if name is not provided', async () => {
    const onSubmit = jest.fn();
    const { getByRole, getByText } = render(
      <SaveImageForm onSubmit={onSubmit} />,
    );
    userEvent.click(getByRole('button', { name: 'Save' }));
    await waitFor(() =>
      expect(getByText('Name is required')).toBeInTheDocument(),
    );
  });

  it('Calls on submit with the provided values on submit', async () => {
    const onSubmit = jest.fn();
    const expected = {
      name: 'Test Name',
      description: 'This is a test description',
    };
    const { getByRole } = render(<SaveImageForm onSubmit={onSubmit} />);
    userEvent.type(getByRole('textbox', { name: 'Add Name' }), expected.name);
    userEvent.type(
      getByRole('textbox', { name: 'Add Description' }),
      expected.description,
    );
    userEvent.click(getByRole('button', { name: 'Save' }));
    await waitFor(() => expect(onSubmit).toBeCalledWith(expected));
  });
});
