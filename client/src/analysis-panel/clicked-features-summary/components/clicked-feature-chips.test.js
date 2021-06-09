import React from 'react';

import { fireEvent, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ClickedFeatureChips } from './clicked-feature-chips.component';

const initialFeatures = new Array(3).fill(undefined).map((_, i) => ({
  object: {
    properties: {
      index: i,
      area_name: `Test Area ${i}`,
      population: i + 1,
      households: i + 10,
    },
  },
}));

const renderComponent = () => {
  const onDeselectAllClick = jest.fn();
  const onFeatureDelete = jest.fn();
  const onFeatureClick = jest.fn();
  const onFeatureHover = jest.fn();

  const utils = render(
    <ClickedFeatureChips
      clickedFeatures={initialFeatures}
      onDeselectAllClick={onDeselectAllClick}
      onFeatureDelete={onFeatureDelete}
      onFeatureClick={onFeatureClick}
      onFeatureHover={onFeatureHover}
      fallbackProperty="index"
    />,
  );
  return {
    ...utils,
    onDeselectAllClick,
    onFeatureDelete,
    onFeatureClick,
    onFeatureHover,
  };
};

describe('<ClickedFeatureChips />', () => {
  it("Works if there's no features", () => {
    const { getAllByRole } = render(<ClickedFeatureChips />);
    expect(getAllByRole('button')).toHaveLength(2);
  });

  it('Shows a chip for each selected area using the area name', () => {
    const { getByText } = renderComponent();
    initialFeatures.forEach(feature =>
      expect(
        getByText(feature.object.properties.area_name),
      ).toBeInTheDocument(),
    );
  });

  it('Changes the Show All button to Hide All when clicked', () => {
    const { getByRole } = renderComponent();
    userEvent.click(getByRole('button', { name: /show\sall/i }));
    expect(getByRole('button', { name: /hide\sall/i })).toBeInTheDocument();
  });

  it("Calls onFeatureDelete with an area when area's delete button is clicked", () => {
    const { getByRole, onFeatureDelete } = renderComponent();
    userEvent.click(getByRole('button', { name: /remove\stest\sarea\s0/i }));
    expect(onFeatureDelete).toHaveBeenCalledWith(initialFeatures[0]);
  });

  it('Calls onFeatureHover with an area when the area`s chip is hovered in', () => {
    const { getByRole, onFeatureHover } = renderComponent();
    fireEvent.mouseEnter(getByRole('button', { name: 'Test Area 0' }));
    expect(onFeatureHover).toHaveBeenCalledWith(initialFeatures[0]);
  });

  it("Calls onFeatureClick with an area when the area's chip is clicked", () => {
    const { getByRole, onFeatureClick } = renderComponent();
    userEvent.click(getByRole('button', { name: 'Test Area 0' }));

    expect(onFeatureClick).toHaveBeenCalledWith(initialFeatures[0]);
  });

  it('Calls onFeatureHover with undefined when the area`s chip is hovered out', () => {
    const { getByRole, onFeatureHover } = renderComponent();
    fireEvent.mouseLeave(getByRole('button', { name: 'Test Area 0' }));
    expect(onFeatureHover).toHaveBeenCalledWith(undefined);
  });

  it('Calls onDeselectAllClick when the Deselect All button is clicked', () => {
    const { getByRole, onDeselectAllClick } = renderComponent();
    userEvent.click(getByRole('button', { name: /deselect\sall/i }));
    expect(onDeselectAllClick).toHaveBeenCalled();
  });
});
