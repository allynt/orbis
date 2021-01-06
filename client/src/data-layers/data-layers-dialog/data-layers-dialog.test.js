import * as React from 'react';
import { render, waitFor } from '@testing-library/react';
import DataLayersDialog from './data-layers-dialog.component';
import userEvent from '@testing-library/user-event';

const ORBS = [
  {
    name: 'Orb 1',
    description: 'Orb 1 Description',
    sources: [
      { source_id: 'orb/1/source/1', metadata: { label: 'Orb 1 Source 1' } },
      { source_id: 'orb/1/source/2', metadata: { label: 'Orb 1 Source 2' } },
    ],
  },
  {
    name: 'Orb 2',
    description: 'Orb 2 Description',
    sources: [
      { source_id: 'orb/2/source/1', metadata: { label: 'Orb 2 Source 1' } },
      { source_id: 'orb/2/source/2', metadata: { label: 'Orb 2 Source 2' } },
    ],
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
    const { getByRole } = renderComponent();
    userEvent.click(getByRole('button', { name: ORBS[0].name }));
    for (let source of ORBS[0].sources) {
      expect(
        getByRole('button', { name: source.metadata.label }),
      ).toBeInTheDocument();
    }
  });

  it('Calls on confirm click with the selected sources', () => {
    const { getByRole, onSubmit } = renderComponent();
    userEvent.click(getByRole('button', { name: ORBS[0].name }));
    userEvent.click(
      getByRole('button', { name: ORBS[0].sources[0].metadata.label }),
    );
    userEvent.click(getByRole('button', { name: ORBS[1].name }));
    userEvent.click(
      getByRole('button', { name: ORBS[1].sources[1].metadata.label }),
    );
    userEvent.click(getByRole('button', { name: /confirm/i }));
    expect(onSubmit).toHaveBeenCalledWith([
      ORBS[0].sources[0].source_id,
      ORBS[1].sources[1].source_id,
    ]);
  });

  it('Calls onSubmit with selected sources without deselected sources', () => {
    const { getByRole, onSubmit } = renderComponent({
      selectedSources: [ORBS[0].sources[0].source_id],
    });
    userEvent.click(getByRole('button', { name: ORBS[0].name }));
    userEvent.click(
      getByRole('button', { name: ORBS[0].sources[0].metadata.label }),
    );
    userEvent.click(getByRole('button', { name: ORBS[1].name }));
    userEvent.click(
      getByRole('button', { name: ORBS[1].sources[1].metadata.label }),
    );
    userEvent.click(getByRole('button', { name: /confirm/i }));
    expect(onSubmit).toHaveBeenCalledWith([ORBS[1].sources[1].source_id]);
  });

  it('Does not remove sources which have not been deselected', async () => {
    const { getByRole, onSubmit } = renderComponent({
      selectedSources: [ORBS[0].sources[0].source_id],
    });
    userEvent.click(getByRole('button', { name: ORBS[1].name }));
    userEvent.click(
      getByRole('button', { name: ORBS[1].sources[1].metadata.label }),
    );
    userEvent.click(getByRole('button', { name: /confirm/i }));
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith([
        ORBS[0].sources[0].source_id,
        ORBS[1].sources[1].source_id,
      ]),
    );
  });
});
