// @ts-nocheck
import React from 'react';

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { RadioGroup } from './radio-group.component';

const DEFAULT_OPTIONS = [
  { value: 1, label: 'One' },
  { value: 2, label: 'Two' },
];

const renderComponent = ({
  defaultValue,
  value,
  options = DEFAULT_OPTIONS,
} = {}) => {
  const onChange = jest.fn();
  const utils = render(
    <RadioGroup
      onChange={onChange}
      options={options}
      defaultValue={defaultValue}
      value={value}
    />,
  );
  return { ...utils, onChange };
};

describe('<RadioGroup />', () => {
  it('Warns if options are not provided', () => {
    console.warn = jest.fn();
    renderComponent({ options: null });
    expect(console.warn).toBeCalled();
  });

  it('Shows a radio for each option provided', () => {
    const { getByRole } = renderComponent();
    expect(getByRole('button', { name: 'One' })).toBeInTheDocument();
    expect(getByRole('button', { name: 'Two' })).toBeInTheDocument();
  });

  it('Shows an image if an option has an image', () => {
    const { getByRole } = renderComponent({
      options: [
        { ...DEFAULT_OPTIONS[0], image: 'testImage' },
        DEFAULT_OPTIONS[1],
      ],
    });
    expect(getByRole('img', { name: 'One image' })).toBeInTheDocument();
  });

  it('Shows and info button if an option has info', () => {
    const { getByRole } = renderComponent({
      options: [
        { ...DEFAULT_OPTIONS[0], info: 'test info' },
        DEFAULT_OPTIONS[1],
      ],
    });
    expect(getByRole('button', { name: 'Info' })).toBeInTheDocument();
  });

  it('Calls onChange when an option is clicked', () => {
    const { getByRole, onChange } = renderComponent();
    userEvent.click(getByRole('button', { name: 'One' }));
    expect(onChange).toBeCalledWith(1);
  });

  it('shows the value of defaultValue selected', () => {
    const { getByRole } = renderComponent({ defaultValue: 2 });
    expect(getByRole('radio', { name: 'Two' })).toBeChecked();
  });

  it('shows the value of value selected', () => {
    const { getByRole } = renderComponent({ value: 2 });
    expect(getByRole('radio', { name: 'Two' })).toBeChecked();
  });
});
