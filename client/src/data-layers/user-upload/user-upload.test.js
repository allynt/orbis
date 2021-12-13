import React from 'react';

import {
  fireFileDropEvent,
  render,
  screen,
  userEvent,
  waitFor,
} from 'test/test-utils';

import { UserUpload } from './user-upload.component';

xdescribe('User Upload', () => {
  it('Can carry out the user upload journey', async () => {
    const onComplete = jest.fn();
    render(<UserUpload onComplete={onComplete} />);
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
    userEvent.click(screen.getByRole('button', { name: /next/i }));
    expect(screen.getByRole('button', { name: /upload/i })).toBeInTheDocument();
    fireFileDropEvent(
      screen.getByTestId('dropzone'),
      new File(['longitude,latitude\n1,2'], 'test.csv'),
    );
    userEvent.type(
      screen.getByRole('textbox', { name: /name your data/i }),
      'Test Data Name',
    );
    await waitFor(() =>
      userEvent.click(screen.getByRole('button', { name: /upload/i })),
    );
    await waitFor(() =>
      expect(
        screen.getByRole('heading', { name: /upload/i }),
      ).toBeInTheDocument(),
    );
    userEvent.click(screen.getByRole('button', { name: /ok/i }));
    expect(onComplete).toBeCalled();
  });
});
