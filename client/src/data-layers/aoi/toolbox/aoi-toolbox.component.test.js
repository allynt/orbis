import React from 'react';

import { render, screen, userEvent, waitFor } from 'test/test-utils';

import AoiToolbox from './aoi-toolbox.component';

describe('AoiToolbox', () => {
  let onToolSelect = null;

  beforeEach(() => {
    onToolSelect = jest.fn();
  });

  it('should display a list of drawing mode buttons', () => {
    render(<AoiToolbox />);

    expect(screen.getByRole('button', { name: 'Point' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Circle' })).toBeInTheDocument();
  });

  it('should call `onToolSelect` function when drawing mode buttons clicked', () => {
    render(<AoiToolbox onToolSelect={onToolSelect} />);

    userEvent.click(screen.getByRole('button', { name: 'Circle' }));
    expect(onToolSelect).toHaveBeenCalledWith('DrawCircleFromCenterMode');

    userEvent.click(screen.getByRole('button', { name: 'Point' }));
    expect(onToolSelect).toHaveBeenCalledWith('DrawPointMode');
  });
});
