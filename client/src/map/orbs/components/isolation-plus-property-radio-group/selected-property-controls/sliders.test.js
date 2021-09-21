import React from 'react';

import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Sliders } from './sliders.component';

describe('<Sliders />', () => {
  it('Shows the range slider by default', () => {
    const { getByTestId, queryByTestId } = render(<Sliders />);
    expect(getByTestId('range-slider')).toBeInTheDocument();
    expect(queryByTestId('color-slider')).not.toBeInTheDocument();
  });

  it('Shows the color adjust slider when the toggle is clicked', async () => {
    const { getByTestId, getByRole, queryByTestId } = render(<Sliders />);
    userEvent.click(getByRole('button', { name: 'Adjust Colour' }));
    await waitFor(() =>
      expect(queryByTestId('range-slider')).not.toBeInTheDocument(),
    );
    expect(getByTestId('color-slider')).toBeInTheDocument();
  });

  it('Calls onRangeFilterChange with the default values when the range slider is visible and reset is clicked', () => {
    const onRangeFilterChange = jest.fn();
    const min = 100,
      max = 1000;
    const { getByRole } = render(
      <Sliders
        selectedProperty={{ min, max }}
        filterRange={[200, 900]}
        onRangeFilterChange={onRangeFilterChange}
      />,
    );
    userEvent.click(getByRole('button', { name: 'Reset' }));
    expect(onRangeFilterChange).toBeCalledWith([min, max]);
  });

  it('Calls onClipRangeChange with the default values when the color slider is visible and reset is clicked', () => {
    const onClipRangeChange = jest.fn();
    const min = 100,
      max = 1000,
      clip_min = 200,
      clip_max = 900;
    const { getByRole } = render(
      <Sliders
        selectedProperty={{ min, max, clip_min, clip_max }}
        clipRange={[100, 1000]}
        onClipRangeChange={onClipRangeChange}
      />,
    );
    userEvent.click(getByRole('button', { name: 'Adjust Colour' }));
    userEvent.click(getByRole('button', { name: 'Reset' }));
    expect(onClipRangeChange).toBeCalledWith([clip_min, clip_max]);
  });

  it('Calls onClipRangeChange with min and max if the property has no clip values', () => {
    const onClipRangeChange = jest.fn();
    const min = 100,
      max = 1000;
    const { getByRole } = render(
      <Sliders
        selectedProperty={{ min, max }}
        clipRange={[100, 1000]}
        onClipRangeChange={onClipRangeChange}
      />,
    );
    userEvent.click(getByRole('button', { name: 'Adjust Colour' }));
    userEvent.click(getByRole('button', { name: 'Reset' }));
    expect(onClipRangeChange).toBeCalledWith([min, max]);
  });
});
