import React from 'react';

import { render, cleanup, fireEvent } from '@testing-library/react';

import BookmarkForm from './bookmark-form.component';

describe('Bookmark Form Component', () => {
  let submit = null;

  beforeEach(cleanup);

  beforeEach(() => {
    submit = jest.fn();
  });

  it('should render the Save Bookmark Form', () => {
    const { getByPlaceholderText, getByText } = render(<BookmarkForm submit={submit} />);

    expect(getByPlaceholderText('Title')).toBeInTheDocument();
    expect(getByPlaceholderText('Description')).toBeInTheDocument();
    expect(getByText('Save Bookmark')).toBeInTheDocument();
  });

  it('should disable the submit button when form is invalid', () => {
    const { getByText } = render(<BookmarkForm submit={submit} />);

    expect(getByText('Save Bookmark')).toHaveAttribute('disabled');
  });

  it('should enable the submit button when form is valid', () => {
    const { getByPlaceholderText, getByText } = render(<BookmarkForm submit={submit} />);

    const submitButton = getByText('Save Bookmark');
    expect(submitButton).toHaveAttribute('disabled');
    fireEvent.change(getByPlaceholderText('Title'), { target: { value: 'New Bookmark Title' } });
    fireEvent.change(getByPlaceholderText('Description'), { target: { value: 'New Bookmark Description' } });
    expect(submitButton).not.toHaveAttribute('disabled');
  });

  it('should call submit function when form is valid and submit button clicked', () => {
    const { getByPlaceholderText, getByText } = render(<BookmarkForm submit={submit} />);

    fireEvent.change(getByPlaceholderText('Title'), { target: { value: 'New Bookmark Title' } });
    fireEvent.change(getByPlaceholderText('Description'), { target: { value: 'New Bookmark Description' } });

    expect(submit).not.toHaveBeenCalled();
    fireEvent.click(getByText('Save Bookmark'));
    expect(submit).toHaveBeenCalledWith({ title: 'New Bookmark Title', description: 'New Bookmark Description' });
  });
});
