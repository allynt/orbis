import * as React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { ExtrusionScaleSlider } from './extrusion-scale-slider.component';
import userEvent from '@testing-library/user-event';

const renderComponent = () => {
  const onChange = jest.fn();
  const utils = render(<ExtrusionScaleSlider onChange={onChange} />);
  return { ...utils, onChange };
};

describe('<ExtrusionScaleSlider />', () => {
  it('calls the onChange event when the slider is dragged', () => {
    const { getByRole, onChange } = renderComponent();
    fireEvent.mouseDown(getByRole('slider'));
    expect(onChange).toHaveBeenCalled();
  });

  it('calls the onChange event when the input is changed', async () => {
    const { getByRole, onChange } = renderComponent();
    userEvent.type(getByRole('textbox'), '60');
    await waitFor(() => expect(onChange).toHaveBeenCalledWith(60));
  });

  it('Shows a message if less than min is entered in the input', async () => {
    const { getByRole, getByText } = renderComponent();
    userEvent.type(getByRole('textbox'), '-10');
    await waitFor(() =>
      expect(
        getByText('Value must be greater than or equal to 1'),
      ).toBeInTheDocument(),
    );
  });

  it('Shows a message if less than min is entered in the input', async () => {
    const { getByRole, getByText } = renderComponent();
    userEvent.type(getByRole('textbox'), '1234');
    await waitFor(() =>
      expect(
        getByText('Value must be less than or equal to 100'),
      ).toBeInTheDocument(),
    );
  });
});
