import * as React from 'react';
import 'jest-canvas-mock';

import { setClickedFeatures, SHARED_STATE_KEY } from 'map/orbs/layers.slice';
import { render, screen, waitFor, userEvent } from 'test/test-utils';

import { AnalysisPanel } from './analysis-panel.component';

const source_id = 'test/source';

const setup = ({ property, clickedFeatures }) => {
  const state = {
    orbs: {
      layers: {
        [SHARED_STATE_KEY]: { other: { property } },
        [source_id]: { clickedFeatures },
      },
    },
  };

  const { store } = render(<AnalysisPanel />, {
    state,
  });
  return { store };
};

describe('<AnalysisPanel />', () => {
  it("doesn't show anything if picked info doesn't have properties", () => {
    setup({ property: { name: 'test' } });
    expect(screen.queryByText(/test/i)).not.toBeInTheDocument();
  });

  it('sets the clickedFeatures to undefined if close is clicked', async () => {
    const { store } = setup({
      property: {
        name: 'test',
        source_id,
        application: { orbis: { data_visualisation_components: [] } },
      },
      clickedFeatures: [
        { object: { id: 1, properties: { code: 'hello', test: '123' } } },
      ],
    });

    userEvent.click(screen.getByRole('button', { name: 'Close' }));
    await waitFor(() =>
      expect(store.getActions()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: setClickedFeatures.type,
            payload: { key: source_id, clickedFeatures: undefined },
          }),
        ]),
      ),
    );
  });

  it('hides PDF button/icon for layers with no compatible components', () => {
    setup({
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
    });

    expect(
      screen.queryByRole('button', { name: 'Export PDF Report' }),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByRole('button', { name: 'PDF export' }),
    ).not.toBeInTheDocument();
  });
});
