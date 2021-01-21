import * as React from 'react';
import { render } from '@testing-library/react';
import { ClickedFeaturesSummary } from './clicked-features-summary.component';
import userEvent from '@testing-library/user-event';
import { removeClickedFeatures } from 'map/orbs/slices/isolation-plus.slice';

const clickedFeatures = new Array(3).fill(undefined).map((_, i) => ({
  object: {
    properties: {
      area_name: `Test Area ${i}`,
      population: i + 1,
      households: i + 10,
    },
  },
}));

const longClickedFeatures = new Array(20).fill(undefined).map((_, i) => ({
  object: {
    properties: {
      area_name: `Test Area ${i}`,
    },
  },
}));

const renderComponent = ({ clickedFeatures = [] }) => {
  const dispatch = jest.fn();
  const utils = render(
    <ClickedFeaturesSummary
      clickedFeatures={clickedFeatures}
      dispatch={dispatch}
    />,
  );
  return { ...utils, dispatch };
};

describe('<ClickedFeaturesSummary />', () => {
  describe('Area Chips', () => {
    it('Shows a chip for each selected area using the area name', () => {
      const { getByText } = renderComponent({ clickedFeatures });
      clickedFeatures.forEach(feature =>
        expect(
          getByText(feature.object.properties.area_name),
        ).toBeInTheDocument(),
      );
    });

    it('Changes the Show All button to Hide All when clicked', () => {
      const { getByRole } = renderComponent({ clickedFeatures });
      userEvent.click(getByRole('button', { name: /show\sall/i }));
      expect(getByRole('button', { name: /hide\sall/i })).toBeInTheDocument();
    });

    it("Deselects and area when that area's delete button is clicked", () => {
      const { getByRole, dispatch } = renderComponent({ clickedFeatures });
      userEvent.click(getByRole('button', { name: /remove\stest\sarea\s0/i }));
      expect(dispatch).toHaveBeenCalledWith(
        removeClickedFeatures([clickedFeatures[0]]),
      );
    });

    it('Deselects all areas when the Deselect All button is clicked', () => {
      const { getByRole, dispatch } = renderComponent({ clickedFeatures });
      userEvent.click(getByRole('button', { name: /deselect\sall/i }));
      expect(dispatch).toHaveBeenCalledWith(
        removeClickedFeatures(clickedFeatures),
      );
    });
  });

  describe('Population', () => {
    it('Shows the total population for a single clicked area', () => {
      const feature = { object: { properties: { population: 1000 } } };
      const { getByText } = renderComponent({ clickedFeatures: [feature] });
      expect(
        getByText(feature.object.properties.population.toString(), {
          exact: false,
        }),
      ).toBeInTheDocument();
    });

    it('Shows the sum of the population for multiple clicked areas', () => {
      const { getByText } = renderComponent({ clickedFeatures });
      expect(getByText('6', { exact: false })).toBeInTheDocument();
    });

    it('Shows the population year', () => {
      const feature = { object: { properties: { population_year: 2077 } } };
      const { getByText } = renderComponent({ clickedFeatures: [feature] });
      expect(
        getByText(feature.object.properties.population_year.toString(), {
          exact: false,
        }),
      ).toBeInTheDocument();
    });
  });

  describe('Households', () => {
    it('Shows the households for a single clicked area', () => {
      const feature = { object: { properties: { households: 1985 } } };
      const { getByText } = renderComponent({ clickedFeatures: [feature] });
      expect(
        getByText(feature.object.properties.households.toString(), {
          exact: false,
        }),
      ).toBeInTheDocument();
    });

    it('Shows the sum of the households for multiple clicked areas', () => {
      const { getByText } = renderComponent({ clickedFeatures });
      expect(getByText('33', { exact: false })).toBeInTheDocument();
    });
  });
});
