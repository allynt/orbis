import React from 'react';
import { render } from '@testing-library/react';

import PopupNote from './popup-note.component';
import userEvent from '@testing-library/user-event';

const defaultNote = {
  id: 123,
  body: 'This is the body of the test note',
};

const longBodyNote = {
  id: 456,
  body:
    'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Doloremque nihil impedit, amet similique sequi error tenetur delectus eveniet natus quis animi odio obcaecati praesentium voluptate reiciendis ad, culpa est at? Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ratione iure blanditiis sequi dolor porro similique, repudiandae laborum natus obcaecati ipsam tempora. Distinctio sunt accusamus ipsum totam. Molestias deserunt dignissimos unde! Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas quis, dolorem est incidunt, sint dicta eum, consectetur natus nostrum facilis officiis voluptates aliquid fuga cupiditate nesciunt aperiam culpa accusamus ea. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Mollitia assumenda doloribus officia perferendis modi totam quos molestiae natus hic quae quisquam nihil omnis consequuntur blanditiis eos, soluta necessitatibus ut cum. Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae autem animi omnis consequuntur fugit nemo natus, eaque, sint ea maxime quo sunt. Enim magnam illo dolorum aliquam obcaecati eum quia! Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi, velit ipsam. Adipisci excepturi alias iste provident, est, atque doloribus beatae omnis debitis, mollitia ut quasi architecto ullam voluptas nemo sit. Lorem ipsum dolor sit amet consectetur adipisicing elit. At modi officia fuga, esse dolorem temporibus delectus facere voluptates, provident ad inventore ipsa exercitationem, ullam amet! Optio laudantium explicabo enim culpa? Lorem ipsum, dolor sit amet consectetur adipisicing elit. Doloremque nihil impedit, amet similique sequi error tenetur delectus eveniet natus quis animi odio obcaecati praesentium voluptate reiciendis ad, culpa est at? Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ratione iure blanditiis sequi dolor porro similique, repudiandae laborum natus obcaecati ipsam tempora. Distinctio sunt accusamus ipsum totam. Molestias deserunt dignissimos unde! Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas quis, dolorem est incidunt, sint dicta eum, consectetur natus nostrum facilis officiis voluptates aliquid fuga cupiditate nesciunt aperiam culpa accusamus ea. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Mollitia assumenda doloribus officia perferendis modi totam quos molestiae natus hic quae quisquam nihil omnis consequuntur blanditiis eos, soluta necessitatibus ut cum. Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae autem animi omnis consequuntur fugit nemo natus, eaque, sint ea maxime quo sunt. Enim magnam illo dolorum aliquam obcaecati eum quia! Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi, velit ipsam. Adipisci excepturi alias iste provident, est, atque doloribus beatae omnis debitis, mollitia ut quasi architecto ullam voluptas nemo sit. Lorem ipsum dolor sit amet consectetur adipisicing elit. At modi officia fuga, esse dolorem temporibus delectus facere voluptates, provident ad inventore ipsa exercitationem, ullam amet! Optio laudantium explicabo enim culpa?',
};

const renderComponent = ({ note = defaultNote }) => {
  const onNoteSave = jest.fn();
  const utils = render(<PopupNote note={note} onNoteSave={onNoteSave} />);

  return { ...utils, onNoteSave };
};

describe('Popup Note', () => {
  it('renders a PopupNote', () => {
    const { getByText, getByLabelText, getByRole } = renderComponent({
      note: null,
    });

    expect(getByText('Note:')).toBeInTheDocument();
    expect(getByLabelText('Popup Note')).toBeInTheDocument();
    expect(getByText('0/3000')).toBeInTheDocument();
    expect(getByRole('button', { name: 'Save' })).toBeInTheDocument();
    expect(getByRole('button', { name: 'Edit' })).toBeInTheDocument();
  });

  it('displays the note body if a note is present', () => {
    const { getByText } = renderComponent({});

    expect(getByText(defaultNote.body)).toBeInTheDocument();
  });

  it('displays character count of the note if present', () => {
    const { getByText } = renderComponent({});

    expect(getByText(`${defaultNote.body.length}/3000`)).toBeInTheDocument();
  });

  it('displays error message if character count exceeds limit', () => {
    const { getByText } = renderComponent({
      note: longBodyNote,
    });

    expect(getByText('Character limit exceeded')).toBeInTheDocument();
  });

  it('disables buttons if character count exceeds limit', () => {
    const { getByRole } = renderComponent({
      note: longBodyNote,
    });

    expect(getByRole('button', { name: 'Save' })).toHaveAttribute('disabled');
    expect(getByRole('button', { name: 'Edit' })).toHaveAttribute('disabled');
  });

  it('disables buttons if no changes have been made', () => {
    const { getByRole } = renderComponent({});
    expect(getByRole('button', { name: 'Save' })).toHaveAttribute('disabled');
    expect(getByRole('button', { name: 'Edit' })).toHaveAttribute('disabled');
  });

  it('calls save handler when save button is clicked', () => {
    const { getByRole, onNoteSave } = renderComponent({ note: null });

    userEvent.type(
      getByRole('textbox', { name: 'Popup Note' }),
      'some note text',
    );

    userEvent.click(getByRole('button', { name: 'Save' }));

    expect(onNoteSave).toHaveBeenCalledWith('some note text');
  });

  it('calls edit handler when edit button is clicked', () => {
    const { getByRole, onNoteEdit } = renderComponent({ note: null });

    userEvent.type(
      getByRole('textbox', { name: 'Popup Note' }),
      'some note text',
    );

    userEvent.click(getByRole('button', { name: 'Edit' }));

    expect(onNoteEdit).toHaveBeenCalledWith('some note text');
  });

  it('sadfg', () => {});
});
