import React from 'react';

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { format } from 'date-fns';

import { Storage } from './storage.component';

const TEST_FILES = new Array(20).fill().map((_, i) => ({
  id: `${i}`,
  title: `file-title-${i}`,
  date: new Date(2020, 0, i).toISOString(),
}));

const renderComponent = () => {
  const utils = render(<Storage files={TEST_FILES} />);
  return { ...utils };
};

describe('<Storage />', () => {
  it('renders a stored files table', () => {
    const { getByText } = renderComponent();

    userEvent.click(getByText('5'));
    userEvent.click(getByText('20'));

    TEST_FILES.forEach(({ title, date }) => {
      const displayDate = format(new Date(date), 'dd-MM-yyyy');
      expect(getByText(title)).toBeInTheDocument();
      expect(getByText(displayDate)).toBeInTheDocument();
    });
  });

  it('opens options menu when ellipsis icon is clicked', () => {
    const { getAllByRole, getByRole } = renderComponent();

    userEvent.click(getAllByRole('button', { name: 'Options' })[0]);

    expect(getByRole('menuitem', { name: 'Delete' })).toBeInTheDocument();
  });

  it('opens dialog when menu button is clicked', () => {
    const { getByRole, getAllByRole } = renderComponent();

    userEvent.click(getAllByRole('button', { name: 'Options' })[0]);
    userEvent.click(getByRole('menuitem', { name: 'Delete' }));

    expect(getByRole('dialog')).toBeInTheDocument();
  });

  it('closes dialog when cancel button is clicked', () => {
    const { getAllByRole, getByRole } = renderComponent();

    userEvent.click(getAllByRole('button', { name: 'Options' })[0]);
    userEvent.click(getByRole('menuitem', { name: 'Delete' }));

    expect(getByRole('dialog')).toBeVisible();

    userEvent.click(getByRole('button', { name: 'Cancel' }));
    expect(getByRole('dialog')).not.toBeVisible();
  });

  it('closes dialog when confirm button is clicked', () => {
    const { getAllByRole, getByRole } = renderComponent();

    userEvent.click(getAllByRole('button', { name: 'Options' })[0]);
    userEvent.click(getByRole('menuitem', { name: 'Delete' }));

    expect(getByRole('dialog')).toBeVisible();

    userEvent.click(getByRole('button', { name: 'Yes' }));
    expect(getByRole('dialog')).not.toBeVisible();
  });
});
