import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { DrawingToolsToolbox } from './drawing-tools-toolbox.component';
import userEvent from '@testing-library/user-event';

describe('<DrawingToolsToolbox />', () => {
  it('Calls onToolSelect when a tool is clicked', async () => {
    const onToolSelect = jest.fn();
    const { getByRole } = render(
      <DrawingToolsToolbox open onToolSelect={onToolSelect} />,
    );
    await waitFor(() => userEvent.click(getByRole('radio', { name: 'Point' })));
    expect(onToolSelect).toBeCalledWith('DrawPointMode');
  });

  it('Calls onToolSelect with view mode when the selected tool is clicked', async () => {
    const onToolSelect = jest.fn();
    const { getByRole } = render(
      <DrawingToolsToolbox
        open
        onToolSelect={onToolSelect}
        selectedTool="DrawPointMode"
      />,
    );
    userEvent.click(getByRole('radio', { name: 'Point' }));
    await waitFor(() => expect(onToolSelect).toBeCalledWith('ViewMode'));
  });
});
