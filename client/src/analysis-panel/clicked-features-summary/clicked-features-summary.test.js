import * as React from 'react';

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AnalysisPanelProvider } from 'analysis-panel/analysis-panel-context';
import {
  removeClickedFeatures,
  setClickedFeatures,
} from 'map/orbs/layers.slice';
import { MapContext } from 'MapContext';

import { ClickedFeaturesSummary } from './clicked-features-summary.component';

jest.mock(
  './create-viewstate-for-feature/create-viewstate-for-feature',
  () => ({
    createViewstateForFeature: () => {
      return {
        latitude: 1,
        longitude: 2,
        zoom: 3,
      };
    },
  }),
);

jest.mock('@math.gl/web-mercator', () => ({
  getFlyToDuration: () => 5,
}));

const initialFeatures = new Array(3).fill(undefined).map((_, i) => ({
  object: {
    id: i,
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [-74, 40],
          [-78, 42],
          [-82, 35],
        ],
      ],
    },
    properties: {
      name: `Test ${i}`,
      area_name: `Test Area ${i}`,
      population: i + 1,
      households: i + 10,
    },
  },
}));

const populationProperty = {
  source_id: 'test/selected/property/latest',
  name: 'population',
  label: 'Test Property',
  description: 'Test Property Description',
  source: 'https://test.com',
};

const householdProperty = {
  source_id: 'test/selected/property/latest',
  name: 'households',
  label: 'Test Property',
  description: 'Test Property Description',
  source: 'https://test.com',
};

const renderComponent = (
  clickedFeatures = initialFeatures,
  selectedProperty = populationProperty,
) => {
  const dispatch = jest.fn(),
    setViewState = jest.fn();

  const utils = render(
    <MapContext.Provider
      value={{
        viewState: {},
        setViewState,
        bottomDeckRef: { current: { viewports: [{ width: 0, height: 0 }] } },
      }}
    >
      <AnalysisPanelProvider
        clickedFeatures={clickedFeatures}
        selectedProperty={selectedProperty}
      >
        <ClickedFeaturesSummary
          clickedFeatures={clickedFeatures}
          dispatch={dispatch}
        />
      </AnalysisPanelProvider>
    </MapContext.Provider>,
  );
  return { ...utils, setViewState, dispatch };
};

describe('<ClickedFeaturesSummary />', () => {
  describe('Area Chips', () => {
    it("Deselects an area when that area's delete button is clicked", () => {
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

    it('Calls setViewState when chip is clicked', () => {
      const { setViewState, getByRole } = renderComponent();

      userEvent.click(getByRole('button', { name: 'Test Area 0' }));

      expect(setViewState).toHaveBeenCalled();
    });
  });

  describe('Population', () => {
    it('Shows the total population for a single clicked area', () => {
      const feature = {
        object: { id: 0, properties: { population: 1000 } },
      };
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
        object: { id: 0, properties: { population: 1, population_year: 2077 } },
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
      const feature = {
        object: { id: 0, properties: { households: 1985 } },
      };
      const { getByText } = renderComponent([feature], householdProperty);
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
