import * as React from 'react';
import { render, waitFor } from '@testing-library/react';
import { AnalysisPanel } from './analysis-panel.component';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { MapProvider } from 'MapContext';
import { createMemoryHistory } from 'history';
import configureMockStore from 'redux-mock-store';
import userEvent from '@testing-library/user-event';
import { setClickedFeatures } from 'map/orbs/layers.slice';

const mockStore = configureMockStore();
const history = createMemoryHistory({ initialEntries: ['/map'] });

const source_id = 'test/source';

const renderComponent = ({ property, clickedFeatures }) => {
  const store = mockStore({
    orbs: {
      layers: {
        'astrosat/isolation_plus': { other: { property } },
        [source_id]: { clickedFeatures },
      },
    },
  });

  const utils = render(
    <Provider store={store}>
      <Router history={history}>
        <MapProvider>
          <AnalysisPanel />
        </MapProvider>
      </Router>
    </Provider>,
  );
  return { ...utils, history, store };
};

describe('<AnalysisPanel />', () => {
  it("doesn't show anything if picked info doesn't have properties", () => {
    const { queryByText } = renderComponent({
      property: { name: 'test' },
    });
    expect(queryByText(/test/i)).not.toBeInTheDocument();
  });

  it('hides the panel when the minimize button is clicked', async () => {
    const { getByRole, getByText } = renderComponent({
      property: {
        name: 'test',
        source_id,
        application: { orbis: { data_visualisation_components: [] } },
      },
      clickedFeatures: [{ object: { id: '123', properties: { test: 1 } } }],
    });
    expect(getByText('Data Analysis')).toBeVisible();
    userEvent.click(getByRole('button', { name: 'minimize' }));
    await waitFor(() => expect(getByText('Data Analysis')).not.toBeVisible());
  });

  it('sets the clickedFeatures to undefined if close is clicked', async () => {
    const { getByRole, store } = renderComponent({
      property: {
        name: 'test',
        source_id,
        application: { orbis: { data_visualisation_components: [] } },
      },
      clickedFeatures: [
        { object: { id: 1, properties: { code: 'hello', test: '123' } } },
      ],
    });
    await waitFor(() =>
      userEvent.click(getByRole('button', { name: 'Close' })),
    );

    expect(store.getActions()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: setClickedFeatures.type,
          payload: { key: source_id, clickedFeatures: undefined },
        }),
      ]),
    );
  });

  it('hides PDF button/icon for layers with no compatible components', () => {
    const state = {
      property: {
        type: 'discrete',
        name: 'test',
        application: {
          orbis: {
            data_visualisation_components: [{ name: 'CategoryBreakdownChart' }],
          },
        },
        categories: [{ 'Digital Seniors': {} }],
      },
      clickedFeatures: [
        { object: { properties: { test: 'Digital Seniors' } } },
      ],
    };

    const { queryByRole } = renderComponent(state);

    expect(
      queryByRole('button', { name: 'Export PDF Report' }),
    ).not.toBeInTheDocument();

    expect(
      queryByRole('button', { name: 'PDF export' }),
    ).not.toBeInTheDocument();
  });
});
