import * as React from 'react';
import { render } from '@testing-library/react';
import { default as LayerSelectItem } from './layer-select-item.component';
import userEvent from '@testing-library/user-event';

/** @type {Source} */
const SOURCE = {
  source_id: 'test/source/123',
  // @ts-ignore
  metadata: {
    description: 'This is the description',
    label: 'Test Source',
  },
};

const renderComponent = ({ selected = false } = {}) => {
  const onChange = jest.fn();
  const utils = render(
    <LayerSelectItem source={SOURCE} selected={selected} onChange={onChange} />,
  );
  return { ...utils, onChange };
};

describe('<LayerSelectItem />', () => {
  it('shows the source label', () => {
    const { getByRole } = renderComponent();
    expect(
      getByRole('checkbox', { name: SOURCE.metadata.label }),
    ).toBeInTheDocument();
  });

  it('shows the source description when the info button is clicked', () => {
    const { getByRole, getByText } = renderComponent();
    userEvent.click(getByRole('button'));
    expect(getByText(SOURCE.metadata.description)).toBeInTheDocument();
  });

  it('hides the source description when the info button is clicked again', () => {
    const { getByRole, getByText, queryByText } = renderComponent();
    userEvent.click(getByRole('button'));
    expect(getByText(SOURCE.metadata.description)).toBeInTheDocument();
    userEvent.click(getByRole('button'));
    expect(queryByText(SOURCE.metadata.description)).not.toBeInTheDocument();
  });

  it('hides the source description when the info box is clicked off', () => {
    const { getByText, getByRole, queryByText } = renderComponent();
    userEvent.click(getByRole('button'));
    expect(getByText(SOURCE.metadata.description)).toBeInTheDocument();
    userEvent.click(getByRole('checkbox'));
    expect(queryByText(SOURCE.metadata.description)).not.toBeInTheDocument();
  });

  it('shows the checkbox as checked when the source is selected', () => {
    const { getByRole } = renderComponent({ selected: true });
    expect(getByRole('checkbox')).toBeChecked();
  });

  it('calls the onChange function with the source id and selected status when the source is toggled on', () => {
    const { getByRole, onChange } = renderComponent();
    userEvent.click(getByRole('checkbox'));
    expect(onChange).toHaveBeenCalledWith({
      source_ids: [SOURCE.source_id],
      selected: true,
    });
  });

  it('calls the onChange function with the source id and selected status when the source is toggled off', () => {
    const { getByRole, onChange } = renderComponent({ selected: true });
    userEvent.click(getByRole('checkbox'));
    expect(onChange).toHaveBeenCalledWith({
      source_ids: [SOURCE.source_id],
      selected: false,
    });
  });
});
