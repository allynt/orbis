import * as React from 'react';

import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { FIELD_NAMES } from 'utils/validators';

import BookmarkForm from './bookmark-form.component';

const TITLE = new RegExp(FIELD_NAMES.bookmarkTitle, 'i');
const DESCRIPTION = new RegExp(FIELD_NAMES.bookmarkDescription, 'i');
const SUBMIT = /save\snew\smap/i;

const renderComponent = () => {
  const onSubmit = jest.fn();
  const utils = render(<BookmarkForm onSubmit={onSubmit} />);
  return { onSubmit, ...utils };
};

describe('<BookmarkForm />', () => {
  it('should render the Save Bookmark Form', () => {
    const { getByRole } = renderComponent();

    expect(getByRole('textbox', { name: TITLE })).toBeInTheDocument();
    expect(getByRole('textbox', { name: DESCRIPTION })).toBeInTheDocument();
    expect(getByRole('button', { name: SUBMIT })).toBeInTheDocument();
  });

  it('should disable the submit button when form is invalid', () => {
    const { getByRole } = renderComponent();
    expect(getByRole('button', { name: SUBMIT })).toBeDisabled();
  });

  it('should enable the submit button when form is valid', async () => {
    const { getByRole } = renderComponent();

    expect(getByRole('button', { name: SUBMIT })).toBeDisabled();
    userEvent.type(getByRole('textbox', { name: TITLE }), 'New Bookmark Title');
    userEvent.type(
      getByRole('textbox', { name: DESCRIPTION }),
      'New Bookmark Description',
    );
    await waitFor(() =>
      expect(getByRole('button', { name: SUBMIT })).toBeEnabled(),
    );
  });

  it('should call submit function when form is valid and submit button clicked', () => {
    const { getByRole, onSubmit } = renderComponent();

    userEvent.type(getByRole('textbox', { name: TITLE }), 'New Bookmark Title');
    userEvent.type(
      getByRole('textbox', { name: DESCRIPTION }),
      'New Bookmark Description',
    );

    expect(onSubmit).not.toHaveBeenCalled();
    userEvent.click(getByRole('button', { name: SUBMIT }));
    waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        title: 'New Bookmark Title',
        description: 'New Bookmark Description',
      }),
    );
  });
});
