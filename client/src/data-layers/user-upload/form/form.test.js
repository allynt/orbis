import React from 'react';

import {
  fireFileDropEvent,
  render,
  screen,
  userEvent,
  waitFor,
} from 'test/test-utils';

import { ERROR_MAP } from '../validate/error-map';
import { Form } from './form.component';

xdescribe('User Upload Form', () => {
  it('Shows the file name when the file has been uploaded and clears again', async () => {
    render(<Form />);
    const fileName = 'test.csv';
    fireFileDropEvent(
      screen.getByTestId('dropzone'),
      new File(['latitude,longitude\n1,2'], fileName),
    );
    await waitFor(() => expect(screen.getByText(fileName)).toBeInTheDocument());
    userEvent.click(screen.getByRole('button', { name: /clear file/i }));
    expect(screen.queryByText(fileName)).not.toBeInTheDocument();
  });

  it('Shows an error message if the file has an error', async () => {
    render(<Form />);
    fireFileDropEvent(
      screen.getByTestId('dropzone'),
      new File(['header1,header2\n1,2'], 'test.csv'),
    );
    await waitFor(() => {
      expect(screen.getByTestId('file-error-message')).toHaveTextContent(
        ERROR_MAP.incorrectHeaders,
      );
    });
  });
});
