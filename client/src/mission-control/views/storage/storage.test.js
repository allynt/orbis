import React from 'react';

import { format } from 'date-fns';

import { render, screen, waitFor, userEvent } from 'test/test-utils';

import { Storage } from './storage.component';

const TEST_FILES = new Array(20).fill().map((_, i) => ({
  id: `${i}`,
  title: `file-title-${i}`,
  created: new Date(2020, 0, i).toISOString(),
}));

describe('<Storage />', () => {
  it('renders a stored files table', () => {
    render(<Storage files={TEST_FILES} />);

    userEvent.click(screen.getByText('5'));
    userEvent.click(screen.getByText('20'));

    TEST_FILES.forEach(({ title, created }) => {
      const displayDate = format(new Date(created), 'dd-MM-yyyy');
      expect(screen.getByText(title)).toBeInTheDocument();
      expect(screen.getByText(displayDate)).toBeInTheDocument();
    });
  });

  it('opens options menu when ellipsis icon is clicked', () => {
    render(<Storage files={TEST_FILES} />);

    userEvent.click(screen.getAllByRole('button', { name: 'Options' })[0]);

    expect(
      screen.getByRole('menuitem', { name: 'Delete' }),
    ).toBeInTheDocument();
  });

  it('opens dialog when menu button is clicked', () => {
    render(<Storage files={TEST_FILES} />);

    userEvent.click(screen.getAllByRole('button', { name: 'Options' })[0]);
    userEvent.click(screen.getByRole('menuitem', { name: 'Delete' }));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('closes dialog when cancel button is clicked', () => {
    render(<Storage files={TEST_FILES} />);

    userEvent.click(screen.getAllByRole('button', { name: 'Options' })[0]);
    userEvent.click(screen.getByRole('menuitem', { name: 'Delete' }));

    expect(screen.getByRole('dialog')).toBeVisible();

    userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(screen.getByRole('dialog')).not.toBeVisible();
  });

  it('closes dialog when confirm button is clicked', async () => {
    const setFiles = jest.fn();
    render(<Storage files={TEST_FILES} setFiles={setFiles} />);

    userEvent.click(screen.getAllByRole('button', { name: 'Options' })[0]);
    userEvent.click(screen.getByRole('menuitem', { name: 'Delete' }));

    expect(screen.getByRole('dialog')).toBeVisible();

    userEvent.click(screen.getByRole('button', { name: 'Yes' }));
    await waitFor(() => expect(screen.getByRole('dialog')).not.toBeVisible());
  });
});
