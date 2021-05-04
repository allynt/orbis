import React from 'react';
import { render } from '@testing-library/react';
import { ClickedFeatureChips } from './clicked-feature-chips.component';
import userEvent from '@testing-library/user-event';

const initialFeatures = new Array(3).fill(undefined).map((_, i) => ({
  index: i,
  object: {
    properties: {
      area_name: `Test Area ${i}`,
      population: i + 1,
      households: i + 10,
    },
  },
}));

const renderComponent = () => {
  const onDeselectAllClick = jest.fn();
  const onFeatureDelete = jest.fn();

  const utils = render(
    <ClickedFeatureChips
      clickedFeatures={initialFeatures}
      onDeselectAllClick={onDeselectAllClick}
      onFeatureDelete={onFeatureDelete}
    />,
  );
  return { ...utils, onDeselectAllClick, onFeatureDelete };
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

  it('Calls onDeselectAllClick when the Deselect All button is clicked', () => {
    const { getByRole, onDeselectAllClick } = renderComponent();
    userEvent.click(getByRole('button', { name: /deselect\sall/i }));
    expect(onDeselectAllClick).toHaveBeenCalled();
  });
});
