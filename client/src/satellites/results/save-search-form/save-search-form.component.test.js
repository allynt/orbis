import React from 'react';

import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import SaveSearchForm from './save-search-form.component';

const renderComponent = () => {
  const onSubmit = jest.fn();
  const utils = render(<SaveSearchForm onSubmit={onSubmit} />);
  return { ...utils, onSubmit };
};

describe('Save Satellite Search Form Component', () => {
  it('should display an error message when `name` text field is invalid', async () => {
    const { getByRole, getByText } = renderComponent();

    userEvent.type(getByRole('textbox'), 'id');
    userEvent.click(getByRole('button'));
    await waitFor(() =>
      expect(
        getByText('Name field must exceed 3 characters'),
      ).toBeInTheDocument(),
    );
  });

  it('should disable `Save Search` button when form is invalid', async () => {
    const { getByRole } = renderComponent();

    expect(getByRole('button')).toBeDisabled();
    userEvent.type(getByRole('textbox'), 'id');
    userEvent.click(getByRole('button'));
    await waitFor(() => expect(getByRole('button')).toBeDisabled());
  });

  it('should enable `Save Search` button when form is valid', async () => {
    const { getByRole } = renderComponent();

    expect(getByRole('button')).toBeDisabled();
    userEvent.type(getByRole('textbox'), 'test');
    await waitFor(() => expect(getByRole('button')).not.toBeDisabled());
  });

  it('calls onSubmit with the name when submitted', async () => {
    const { getByRole, onSubmit } = renderComponent();
    userEvent.type(getByRole('textbox'), 'Test Name');
    userEvent.click(getByRole('button'));
    await waitFor(() => expect(onSubmit).toBeCalledWith('Test Name'));
  });
});
