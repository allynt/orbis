import React from 'react';

import { render, screen, userEvent } from 'test/test-utils';

import Aoi from './aoi.component';

describe('AOI Component', () => {
  let onDrawAoiClick = null;

  beforeEach(() => {
    onDrawAoiClick = jest.fn();
  });

  it('should display the panel', () => {
    render(<Aoi />);

    expect(
      screen.getByText('Please draw the Area Of Interest on the map.'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Draw your AOI' }),
    ).toBeInTheDocument();
  });

  it('should react to AOI button click', () => {
    render(<Aoi onDrawAoiClick={onDrawAoiClick} />);

    userEvent.click(screen.getByRole('button', { name: 'Draw your AOI' }));

    expect(onDrawAoiClick).toHaveBeenCalled();
  });
});
