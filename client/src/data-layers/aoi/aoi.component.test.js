import React from 'react';

import { render, screen, userEvent, waitFor } from 'test/test-utils';

import Aoi from './aoi.component';

describe('AOI Component', () => {
  let onDrawAoiClick = null;
  let onSubmit = null;

  beforeEach(() => {
    onDrawAoiClick = jest.fn();
    onSubmit = jest.fn();
  });

  it('should display the panel', () => {
    render(<Aoi />);

    expect(screen.getByRole('heading', { name: 'Search' })).toBeInTheDocument();
    expect(
      screen.getByText(
        'Please select the Area Of Interest on the map to search for available data.',
      ),
    ).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Point' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Circle' })).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('should call `onDrawAoiClick` function when `AOI Mode` button clicked', () => {
    render(<Aoi onDrawAoiClick={onDrawAoiClick} />);

    userEvent.click(screen.getByRole('button', { name: 'Circle' }));

    expect(onDrawAoiClick).toHaveBeenCalled();
  });

  it('should call `onSubmit` function when dialog `Save AOI` button clicked', async () => {
    render(<Aoi onSubmit={onSubmit} />);

    userEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(
      screen.getByRole('heading', { name: 'Name Your Aoi' }),
    ).toBeInTheDocument();

    const name = 'Test AOI';
    userEvent.type(
      screen.getByRole('textbox', { name: 'Add Name' }),
      'Test AOI',
    );
    const description = 'Test Description';
    userEvent.type(
      screen.getByRole('textbox', { name: 'Add Description' }),
      'Test Description',
    );

    userEvent.click(screen.getByRole('button', { name: 'Save AOI' }));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({ name, description }),
    );
  });
});
