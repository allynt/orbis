import * as React from 'react';
import { render, waitFor } from '@testing-library/react';
import { AnalysisPanel } from './analysis-panel.component';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { MapProvider } from 'MapContext';
import { createMemoryHistory } from 'history';
import configureMockStore from 'redux-mock-store';
import userEvent from '@testing-library/user-event';
import { setClickedFeatures } from 'map/orbs/slices/isolation-plus.slice';

const mockStore = configureMockStore();
const history = createMemoryHistory({ initialEntries: ['/map'] });

const renderComponent = (state = {}) => {
  const store = mockStore({
    orbs: {
      isolationPlus: {
        ...state,
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
      pickedInfo: { object: {} },
    });
    expect(queryByText(/test/i)).not.toBeInTheDocument();
  });

  it('hides the panel when the minimize button is clicked', async () => {
    const { getByRole, getByText } = renderComponent({
      property: {
        name: 'test',
        application: { orbis: { data_visualisation_components: [] } },
      },
      clickedFeatures: [{ object: { properties: { test: 1 } } }],
    });
    expect(getByText('Data Analysis')).toBeVisible();
    userEvent.click(getByRole('button', { name: 'minimize' }));
    await waitFor(() => expect(getByText('Data Analysis')).not.toBeVisible());
  });

  it('sets the clickedFeatures to undefined if close is clicked', async () => {
    const { getByRole, store } = renderComponent({
      property: {
        name: 'test',
        application: { orbis: { data_visualisation_components: [] } },
      },
      clickedFeatures: [{ object: { properties: { code: 'hello' } } }],
    });
    await waitFor(() =>
      userEvent.click(getByRole('button', { name: 'Close' })),
    );

    expect(store.getActions()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: setClickedFeatures.type,
          payload: undefined,
        }),
      ]),
    );
  });

  it('dispatches screenshot and redirects to PDF route when button is clicked', () => {
    const { getByText, store } = renderComponent({
      property: {
        name: 'test',
        application: { orbis: { data_visualisation_components: [] } },
      },
      clickedFeatures: [{ object: { properties: { code: 'hello' } } }],
    });

    userEvent.click(getByText('Export PDF Report'));

    console.log('state: ', store.getState());
  });

  it('redirects to PDF route when button is clicked', () => {
    const { getByText, history } = renderComponent({
      property: {
        source_id: 'test_id',
        name: 'test',
        application: { orbis: { data_visualisation_components: [] } },
      },
      clickedFeatures: [{ object: { properties: { code: 'hello' } } }],
    });

    userEvent.click(getByText('Export PDF Report'));

    expect(history.location.pathname).toEqual('/pdf-export');
  });

  it('hides PDF button/icon for layers with no compatible components', () => {
    const state = {
      property: {
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

    const { queryByText, queryByLabelText } = renderComponent(state);

    expect(queryByText('Export PDF Report')).not.toBeInTheDocument();

    expect(queryByLabelText('PDF export')).not.toBeInTheDocument();
  });
});
