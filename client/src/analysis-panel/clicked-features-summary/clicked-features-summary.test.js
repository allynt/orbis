import * as React from 'react';

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ClickedFeaturesSummary } from './clicked-features-summary.component';
import {
  removeClickedFeatures,
  setClickedFeatures,
} from 'map/orbs/layers.slice';
import { AnalysisPanelProvider } from 'analysis-panel/analysis-panel-context';

const initialFeatures = new Array(3).fill(undefined).map((_, i) => ({
  object: {
    properties: {
      area_name: `Test Area ${i}`,
      population: i + 1,
      households: i + 10,
    },
  },
}));

const renderComponent = (clickedFeatures = initialFeatures) => {
  const dispatch = jest.fn();

  const utils = render(
    <AnalysisPanelProvider clickedFeatures={clickedFeatures}>
      <ClickedFeaturesSummary
        clickedFeatures={clickedFeatures}
        dispatch={dispatch}
      />
    </AnalysisPanelProvider>,
  );
  return { ...utils, dispatch };
};

describe('<ClickedFeaturesSummary />', () => {
  describe('Area Chips', () => {
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

    it("Deselects and area when that area's delete button is clicked", () => {
      const { getByRole, dispatch } = renderComponent();
      userEvent.click(getByRole('button', { name: /remove\stest\sarea\s0/i }));
      expect(dispatch).toHaveBeenCalledWith(
        removeClickedFeatures(
          expect.objectContaining({ clickedFeatures: [initialFeatures[0]] }),
        ),
      );
    });

    it('Deselects all areas when the Deselect All button is clicked', () => {
      const { getByRole, dispatch } = renderComponent();
      userEvent.click(getByRole('button', { name: /deselect\sall/i }));
      expect(dispatch).toHaveBeenCalledWith(
        setClickedFeatures(
          expect.objectContaining({ clickedFeatures: undefined }),
        ),
      );
    });

    it('Has a tooltip for long area names', () => {
      const long = "This is a long name, oh my it's so long, like good grief";
      const { getByRole } = renderComponent([
        {
          object: {
            properties: {
              area_name: long,
            },
          },
        },
      ]);
      expect(getByRole('tooltip', { name: long })).toBeInTheDocument();
    });
  });

  describe('Population', () => {
    it('Shows the total population for a single clicked area', () => {
      const feature = { object: { properties: { population: 1000 } } };
      const { getByText } = renderComponent([feature]);
      expect(
        getByText(feature.object.properties.population.toLocaleString(), {
          exact: false,
        }),
      ).toBeInTheDocument();
    });

    it('Shows the sum of the population for multiple clicked areas', () => {
      const { getByText } = renderComponent();
      expect(getByText('6', { exact: false })).toBeInTheDocument();
    });

    it('Shows the population year', () => {
      const feature = {
        object: { properties: { population: 1, population_year: 2077 } },
      };
      const { getByText } = renderComponent([feature]);
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
      const { getByText } = renderComponent([feature]);
      expect(
        getByText(feature.object.properties.households.toLocaleString(), {
          exact: false,
        }),
      ).toBeInTheDocument();
    });

    it('Shows the sum of the households for multiple clicked areas', () => {
      const { getByText } = renderComponent();
      expect(getByText('33', { exact: false })).toBeInTheDocument();
    });
  });
});
