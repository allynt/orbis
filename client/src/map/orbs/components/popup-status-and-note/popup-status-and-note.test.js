import React from 'react';

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import PopupStatusAndNote from './popup-status-and-note.component';

export const defaultNote = 'This is a test note';

export const longBodyNote = new Array(3001).fill('0').join('');

const defaultStatus = 'NEW';

const renderComponent = ({
  id = 123,
  note = defaultNote,
  status = defaultStatus,
}) => {
  const onSave = jest.fn();
  const utils = render(
    <PopupStatusAndNote id={id} note={note} status={status} onSave={onSave} />,
  );

  return { ...utils, onSave };
};

describe('Popup Status And Note', () => {
  it('renders a PopupStatusAndNote', () => {
    const { getByText, getByLabelText, getByRole } = renderComponent({
      note: null,
    });

    expect(getByText('Note:')).toBeInTheDocument();
    expect(getByLabelText('Popup Note')).toBeInTheDocument();
    expect(getByText('0/3000')).toBeInTheDocument();
    expect(getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('displays edit button if note is present', () => {
    const { getByRole } = renderComponent({ note: defaultNote });

    expect(getByRole('button', { name: 'Edit' })).toBeInTheDocument();
  });

  it('displays the note if note is present', () => {
    const { getByRole } = renderComponent({});

    expect(getByRole('textbox', { name: 'Popup Note' })).toHaveDisplayValue(
      defaultNote,
    );
  });

  it('defaults to empty text field if no note is present', () => {
    const { getByRole } = renderComponent({ note: '' });

    expect(getByRole('textbox', { name: 'Popup Note' })).toHaveDisplayValue('');
  });

  it('displays the status if status is present', () => {
    const { getByRole } = renderComponent({ status: 'COMPLETE' });

    expect(getByRole('radio', { name: 'Complete' })).toBeChecked();
  });

  it('Defaults to `New` if no status is present', () => {
    const { getByRole } = renderComponent({ id: 123, status: null });

    expect(getByRole('radio', { name: 'New' })).toBeChecked();
  });

  it('displays character count of the note if present', () => {
    const { getByText } = renderComponent({});

    expect(getByText(`${defaultNote.length}/3000`)).toBeInTheDocument();
  });

  it('enables text area when edit button is clicked', () => {
    const { getByRole } = renderComponent({});

    expect(getByRole('textbox', { name: 'Popup Note' })).toBeEnabled();

    userEvent.click(getByRole('button', { name: 'Edit' }));

    expect(getByRole('textbox', { name: 'Popup Note' })).toBeEnabled();
  });

  it('displays error message if character count exceeds limit', () => {
    const { getByText } = renderComponent({
      note: longBodyNote,
    });

    expect(getByText('Character limit exceeded')).toBeInTheDocument();
  });

  it('disables save button if character count exceeds limit', () => {
    const { getByRole } = renderComponent({
      note: longBodyNote,
    });

    expect(getByRole('button', { name: 'Save' })).toBeDisabled();
  });

  it('disables save button if no changes have been made', () => {
    const { getByRole } = renderComponent({});
    expect(getByRole('button', { name: 'Save' })).toBeDisabled();
  });

  it('disables save button if no data and no changes have been made', () => {
    const { getByRole } = renderComponent({
      id: 123,
      notes: null,
      status: null,
    });

    expect(getByRole('button', { name: 'Save' })).toBeDisabled();
  });

  it('enables save button if status has been changed', () => {
    const { getByRole } = renderComponent({});

    userEvent.click(getByRole('radio', { name: 'Followup' }));

    expect(getByRole('button', { name: 'Save' })).toBeEnabled();
  });

  it('enables save button if text area has been changed', () => {
    const { getByRole } = renderComponent({});

    userEvent.click(getByRole('button', { name: 'Edit' }));
    userEvent.type(getByRole('textbox', { name: 'Popup Note' }), 'some text');

    expect(getByRole('button', { name: 'Save' })).toBeEnabled();
  });

  it('calls save handler when save button is clicked', () => {
    const { getByRole, onSave } = renderComponent({ note: null });

    userEvent.type(
      getByRole('textbox', { name: 'Popup Note' }),
      'some note text',
    );

    userEvent.click(getByRole('button', { name: 'Save' }));

    expect(onSave).toHaveBeenCalledWith({ id: 123, notes: 'some note text' });
  });

  it('trims trailing whitespace of saved note', () => {
    const { getByRole, onSave } = renderComponent({ note: null });

    userEvent.type(
      getByRole('textbox', { name: 'Popup Note' }),
      'some text with whitespace     ',
    );

    userEvent.click(getByRole('button', { name: 'Save' }));

    expect(onSave).toHaveBeenCalledWith({
      id: 123,
      notes: 'some text with whitespace',
    });
  });
});
