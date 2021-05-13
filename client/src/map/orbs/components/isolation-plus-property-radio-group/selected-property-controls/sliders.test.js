import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { Sliders } from './sliders.component';

describe('<Sliders />', () => {
  it('Shows the range slider by default', () => {
    const { getByTestId, queryByTestId } = render(<Sliders />);
    expect(getByTestId('range-slider')).toBeInTheDocument();
    expect(queryByTestId('color-slider')).not.toBeInTheDocument();
  });

  it('Shows the color adjust slider when the toggle is clicked', async () => {
    const { getByTestId, getByRole, queryByTestId } = render(
      <Sliders selectedProperty={{ min: 0, max: 1 }} />,
    );
    userEvent.click(getByRole('checkbox'));
    await waitFor(() =>
      expect(queryByTestId('range-slider')).not.toBeInTheDocument(),
    );
    expect(getByTestId('color-slider')).toBeInTheDocument();
  });
});
