import * as React from 'react';
import { render } from '@testing-library/react';
import { ClickedFeaturesSummary } from './clicked-features-summary.component';
import userEvent from '@testing-library/user-event';

/*
  Feature properties
  households
  population
  population_year
  area_name
  within_lad
  within_lad_name
  within_lsoa
  within_msoa
*/

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

    it('Only shows the first two rows of chips', () => {
      const { getByText } = renderComponent({
        clickedFeatures: longClickedFeatures,
      });
      expect(
        getByText(
          longClickedFeatures[longClickedFeatures.length - 1].object.properties
            .area_name,
        ),
      ).not.toBeVisible();
    });

    it('Shows all the chips when the "Show All" button is clicked', () => {
      const { getByRole, getByText } = renderComponent({
        clickedFeatures: longClickedFeatures,
      });
      expect(
        getByText(
          longClickedFeatures[longClickedFeatures.length - 1].object.properties
            .area_name,
        ),
      ).not.toBeVisible();
      userEvent.click(getByRole('button', { name: /show\sall/i }));
      expect(
        getByText(
          longClickedFeatures[longClickedFeatures.length - 1].object.properties
            .area_name,
        ),
      ).toBeVisible();
    });

    it('Hides all the chips when "Show Less" is clicked', () => {
      const { getByRole, getByText } = renderComponent({
        clickedFeatures: longClickedFeatures,
      });
      expect(
        getByText(
          longClickedFeatures[longClickedFeatures.length - 1].object.properties
            .area_name,
        ),
      ).not.toBeVisible();
      userEvent.click(getByRole('button', { name: /show\sall/i }));
      expect(
        getByText(
          longClickedFeatures[longClickedFeatures.length - 1].object.properties
            .area_name,
        ),
      ).toBeVisible();
      userEvent.click(getByRole('button', { name: /show\sless/i }));
      expect(
        getByText(
          longClickedFeatures[longClickedFeatures.length - 1].object.properties
            .area_name,
        ),
      ).not.toBeVisible();
    });

    it("Deselects and area when that area's delete button is clicked", () => {
      const { getByRole, dispatch } = renderComponent({ clickedFeatures });
      userEvent.click(getByRole('button', { name: /remove\sarea\s0/i }));
      expect(dispatch).toHaveBeenCalledWith(
        removeClickedFeature(clickedFeatures[0]),
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
        getByText(feature.object.properties.population.toString()),
      ).toBeInTheDocument();
    });

    it('Shows the sum of the population for multiple clicked areas', () => {
      const { getByText } = renderComponent({ clickedFeatures });
      expect(getByText('6')).toBeInTheDocument();
    });

    it('Shows the population year', () => {
      const feature = { object: { properties: { population_year: 2077 } } };
      const { getByText } = renderComponent({ clickedFeatures: [feature] });
      expect(
        getByText(feature.object.properties.population_year.toString()),
      ).toBeInTheDocument();
    });
  });

  describe('Households', () => {
    it('Shows the households for a single clicked area', () => {
      const feature = { object: { properties: { households: 1985 } } };
      const { getByText } = renderComponent({ clickedFeatures: [feature] });
      expect(
        getByText(feature.object.properties.households.toString()),
      ).toBeInTheDocument();
    });

    it('Shows the sum of the households for multiple clicked areas', () => {
      const { getByText } = renderComponent({ clickedFeatures });
      expect(getByText('33')).toBeInTheDocument();
    });
  });
});
