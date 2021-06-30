import React from 'react';

import { render, cleanup, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { SEARCH } from '../satellites-panel.component';
import Visualisation from './visualisation.component';

const mockStore = configureMockStore([thunk]);

describe('Satellite Visualisation Component', () => {
  const store = mockStore({});
  let visualisations = null;
  let setVisiblePanel = null;
  let removeScenes = null;

  beforeEach(cleanup);

  beforeEach(() => {
    visualisations = [
      {
        id: 1,
        label: 'Visualisation One',
        description: 'Visualisation One Description',
        thumbnail: '/test-thumbnail-1.png',
      },
      {
        id: 2,
        label: 'Visualisation Two',
        description: 'Visualisation Two Description',
        thumbnail: '/test-thumbnail-2.png',
      },
    ];
    setVisiblePanel = jest.fn();
    removeScenes = jest.fn();
  });

  it('should render a list of visualisation options', () => {
    const { getByText, getAllByRole } = render(
      <Provider store={store}>
        <Visualisation
          visualisations={visualisations}
          setVisiblePanel={setVisiblePanel}
          removeScenes={removeScenes}
        />
      </Provider>,
    );

    expect(getByText('VISUALISATION')).toBeInTheDocument();
    expect(getAllByRole('button')).toHaveLength(2);

    visualisations.forEach(visualisation => {
      expect(getByText(visualisation.label)).toBeInTheDocument();
      expect(getByText(visualisation.description)).toBeInTheDocument();
    });
  });
});
