import React from 'react';
import { render } from '@testing-library/react';

import PopupStatusAndNote from './popup-status-and-note.component';
import userEvent from '@testing-library/user-event';

export const defaultNote = 'This is a test note';

export const longBodyNote =
  'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Doloremque nihil impedit, amet similique sequi error tenetur delectus eveniet natus quis animi odio obcaecati praesentium voluptate reiciendis ad, culpa est at? Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ratione iure blanditiis sequi dolor porro similique, repudiandae laborum natus obcaecati ipsam tempora. Distinctio sunt accusamus ipsum totam. Molestias deserunt dignissimos unde! Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas quis, dolorem est incidunt, sint dicta eum, consectetur natus nostrum facilis officiis voluptates aliquid fuga cupiditate nesciunt aperiam culpa accusamus ea. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Mollitia assumenda doloribus officia perferendis modi totam quos molestiae natus hic quae quisquam nihil omnis consequuntur blanditiis eos, soluta necessitatibus ut cum. Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae autem animi omnis consequuntur fugit nemo natus, eaque, sint ea maxime quo sunt. Enim magnam illo dolorum aliquam obcaecati eum quia! Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi, velit ipsam. Adipisci excepturi alias iste provident, est, atque doloribus beatae omnis debitis, mollitia ut quasi architecto ullam voluptas nemo sit. Lorem ipsum dolor sit amet consectetur adipisicing elit. At modi officia fuga, esse dolorem temporibus delectus facere voluptates, provident ad inventore ipsa exercitationem, ullam amet! Optio laudantium explicabo enim culpa? Lorem ipsum, dolor sit amet consectetur adipisicing elit. Doloremque nihil impedit, amet similique sequi error tenetur delectus eveniet natus quis animi odio obcaecati praesentium voluptate reiciendis ad, culpa est at? Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ratione iure blanditiis sequi dolor porro similique, repudiandae laborum natus obcaecati ipsam tempora. Distinctio sunt accusamus ipsum totam. Molestias deserunt dignissimos unde! Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas quis, dolorem est incidunt, sint dicta eum, consectetur natus nostrum facilis officiis voluptates aliquid fuga cupiditate nesciunt aperiam culpa accusamus ea. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Mollitia assumenda doloribus officia perferendis modi totam quos molestiae natus hic quae quisquam nihil omnis consequuntur blanditiis eos, soluta necessitatibus ut cum. Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae autem animi omnis consequuntur fugit nemo natus, eaque, sint ea maxime quo sunt. Enim magnam illo dolorum aliquam obcaecati eum quia! Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi, velit ipsam. Adipisci excepturi alias iste provident, est, atque doloribus beatae omnis debitis, mollitia ut quasi architecto ullam voluptas nemo sit. Lorem ipsum dolor sit amet consectetur adipisicing elit. At modi officia fuga, esse dolorem temporibus delectus facere voluptates, provident ad inventore ipsa exercitationem, ullam amet! Optio laudantium explicabo enim culpa?';

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
    const { getByRole } = renderComponent({});

    expect(getByRole('textbox', { name: 'Popup Note' })).toHaveDisplayValue('');
  });

  xit('displays the status if status is present', () => {
    const status = 'COMPLETED';
    const { getByRole } = renderComponent({ status });

    expect(getByRole('radio', { name: status })).toHaveAttribute('checked');
  });

  xit('Defaults to `New` if no status is present', () => {
    const { getByRole } = renderComponent({});

    expect(getByRole('radio', { name: defaultStatus })).toHaveAttribute(
      'checked',
    );
  });

  it('displays character count of the note if present', () => {
    const { getByText } = renderComponent({});

    expect(getByText(`${defaultNote.length}/3000`)).toBeInTheDocument();
  });

  it('enables text area when edit button is clicked', () => {
    const { getByRole } = renderComponent({});

    expect(getByRole('textbox', { name: 'Popup Note' })).toHaveAttribute(
      'disabled',
    );

    userEvent.click(getByRole('button', { name: 'Edit' }));

    expect(getByRole('textbox', { name: 'Popup Note' })).not.toHaveAttribute(
      'disabled',
    );
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

    expect(getByRole('button', { name: 'Save' })).toHaveAttribute('disabled');
  });

  it('disables save button if no changes have been made', () => {
    const { getByRole } = renderComponent({});
    expect(getByRole('button', { name: 'Save' })).toHaveAttribute('disabled');
  });

  xit('enables save button if status has been changed', () => {
    const { getByRole } = renderComponent({});

    userEvent.click(getByRole('radio', { name: 'FOLLOWUP' }));

    expect(getByRole('button', { name: 'Save' })).not.toHaveAttribute(
      'disabled',
    );
  });

  it('enables save button if text area has been changed', () => {
    const { getByRole } = renderComponent({});

    userEvent.click(getByRole('button', { name: 'Edit' }));
    userEvent.type(getByRole('textbox', { name: 'Popup Note' }), 'some text');

    expect(getByRole('button', { name: 'Save' })).not.toHaveAttribute(
      'disabled',
    );
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
