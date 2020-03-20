import React from 'react';

import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { render, cleanup, fireEvent } from '@testing-library/react';

import { SEARCH } from './satellites-panel.component';

import Visualisation from './visualisation.component';

const mockStore = configureMockStore([thunk]);

describe('Satellite Visualisation Component', () => {
  const store = mockStore({});
  let visualisations = null;
  let setVisiblePanel = null;

  beforeEach(cleanup);

  beforeEach(() => {
    visualisations = [
      {
        id: 1,
        label: 'Visualisation One',
        description: 'Visualisation One Description',
        thumbnail: '/test-thumbnail-1.png'
      },
      {
        id: 2,
        label: 'Visualisation Two',
        description: 'Visualisation Two Description',
        thumbnail: '/test-thumbnail-2.png'
      }
    ];
    setVisiblePanel = jest.fn();
  });

  it('should render a list of visualisation options', () => {
    const { getByText, container } = render(
      <Provider store={store}>
        <Visualisation visualisations={visualisations} setVisiblePanel={setVisiblePanel}></Visualisation>
      </Provider>
    );

    expect(getByText('VISUALISATION')).toBeInTheDocument();
    expect(container.querySelectorAll('.visualisation').length).toBe(2);

    visualisations.forEach(visualisation => {
      expect(getByText(visualisation.label)).toBeInTheDocument();
      expect(getByText(visualisation.description)).toBeInTheDocument();
    });
  });

  it('should trigger a panel change when setVisiblePanel called', () => {
    const { getByText } = render(
      <Provider store={store}>
        <Visualisation visualisations={visualisations} setVisiblePanel={setVisiblePanel}></Visualisation>
      </Provider>
    );

    fireEvent.click(getByText('Return to Search'));
    expect(setVisiblePanel).toHaveBeenCalledWith(SEARCH);
  });
});
