import * as React from 'react';
import { render, waitFor } from '@testing-library/react';
import DataLayersDialog from './data-layers-dialog.component';
import userEvent from '@testing-library/user-event';

const application = {
  orbis: {
    categories: {
      name: 'Test Parent Name',
      child: {
        name: 'Test Child Name',
      },
    },
    orbs: [
      {
        name: 'Test Orb Name',
      },
    ],
  },
};

const ORBS = [
  {
    source_id: 'orb/1/source/1',
    metadata: { label: 'Orb 1 Source 1', application },
  },
  {
    source_id: 'orb/1/source/2',
    metadata: { label: 'Orb 1 Source 2', application },
  },
  {
    source_id: 'orb/2/source/1',
    metadata: { label: 'Orb 2 Source 1', application },
  },
  {
    source_id: 'orb/2/source/2',
    metadata: { label: 'Orb 2 Source 2', application },
  },
];

const renderComponent = ({ selectedSources = [] } = {}) => {
  const onSubmit = jest.fn();
  const close = jest.fn();
  const utils = render(
    <DataLayersDialog
      orbs={ORBS}
      onSubmit={onSubmit}
      close={close}
      open
      initialSelectedSources={selectedSources}
    />,
  );
  return { ...utils, onSubmit, close };
};

describe('<DataLayersDialog />', () => {
  it('calls close when the background is clicked', () => {
    const { getByRole, close } = renderComponent();
    userEvent.click(getByRole('none'));
    expect(close).toHaveBeenCalled();
  });

  it('Shows the sources for the selected orb', () => {
    const { getByRole, getByText } = renderComponent();
    userEvent.click(getByRole('button', { name: 'Test Orb Name' }));

    expect(getByText('Test Parent Name')).toBeInTheDocument();
  });

  it('Calls on confirm click with the selected sources', () => {
    const { getByRole, getByText, onSubmit } = renderComponent();
    userEvent.click(getByRole('button', { name: 'Test Orb Name' }));
    userEvent.click(getByText('Test Parent Name'));
    userEvent.click(getByText('Test Child Name'));
    userEvent.click(getByText('Orb 1 Source 1'));
    userEvent.click(getByRole('button', { name: /confirm/i }));
    expect(onSubmit).toHaveBeenCalledWith(['orb/1/source/1']);
  });

  it('Calls onSubmit with selected sources without deselected sources', () => {
    const { getByRole, getByText, onSubmit } = renderComponent({
      selectedSources: ['orb/1/source/1'],
    });

    userEvent.click(getByRole('button', { name: 'Test Orb Name' }));
    userEvent.click(getByText('Test Parent Name'));
    userEvent.click(getByText('Test Child Name'));
    userEvent.click(getByText('Orb 1 Source 2'));
    userEvent.click(getByText('Orb 1 Source 1'));

    userEvent.click(getByRole('button', { name: /confirm/i }));
    expect(onSubmit).toHaveBeenCalledWith(['orb/1/source/2']);
  });

  it('Does not remove sources which have not been deselected', async () => {
    const { getByRole, getByText, onSubmit } = renderComponent({
      selectedSources: ['orb/1/source/1'],
    });

    userEvent.click(getByRole('button', { name: 'Test Orb Name' }));
    userEvent.click(getByText('Test Parent Name'));
    userEvent.click(getByText('Test Child Name'));
    userEvent.click(getByText('Orb 1 Source 2'));

    userEvent.click(getByRole('button', { name: /confirm/i }));
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith([
        'orb/1/source/1',
        'orb/1/source/2',
      ]),
    );
  });
});
